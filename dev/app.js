sandbox(function(s){
  var app = angular.module('app', ['ui.router','angular-modelizer']);
  var COMPILEPROVIDER; // so we can lazy-define directives
  var STATEPROVIDER; // ditto for states
  var INJECTOR;
  var HTTPPROVIDER;
  var TOSTATE;
  var TOPARAMS;
  var DEBUG = !/stateParams/;
  s.modulePaths = requirejs.s.contexts._.config.paths;


  /**
   * app wide naming standardization
   */
  var normedModules = window._sandboxConfig.normedModules;

  // get a normalized/standardized module

  /**
   * angular module config() phase
   * All it does is handle route and state creation.
   */
  app.config(['$stateProvider','$urlRouterProvider','$compileProvider',
  function ($stateProvider,$urlRouterProvider,$compileProvider,$httpProvider) {
    COMPILEPROVIDER = $compileProvider;
    HTTPPROVIDER = $httpProvider;
    STATEPROVIDER = $stateProvider;

    // when route isn't found,
    $urlRouterProvider.otherwise(function ($injector,$location) {
    // ensure we always have a trailing slash
      var path = $location.url();
      if (!/\/\??$/.test(path)){
        path = ((path[path.length - 1] === '?') ? path.replace(/\?$/, '/?') : path + '/');
      }
      console.log('$otherwise',path);
      $injector.get('$state').transitionTo(path,{},{reload:false,inherit:false,notify:false,location:false});
    });
  }]);

  /**
   * angular module run() phase
   */
  app.run(['$rootScope', '$location','$state','$injector','$urlMatcherFactory',
    function($rootScope,$location,$state,$injector,$urlMatcherFactory){
    INJECTOR = $injector;
    // enable rootscope digests on promise resolution, as $q does
    // see: https://github.com/angular/angular.js/blob/master/src/ng/q.js#L219
    // We may be able to improve performance by only activating digests on the
    // calling sandbox, but we don't need the extra performance right now.
    s.p.setScheduler(function (cb) {
      $rootScope.$evalAsync(cb);
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeStart to '+toState.name+' from '+fromState.name+' - fired when the transition begins.');
      TOSTATE = toState;
      TOPARAMS = toParams;
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams,err){
      console.log('$stateChangeError - fired when an error occurs during transition.');
      console.log.apply(console,arguments);
      if (err){throw err; }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeSuccess to '+toState.name+' from '+fromState.name+' - fired once the state transition is complete.');
    });
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams,err){
      console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
      event.preventDefault();
      var baseState = ['states'];
      var isPath = unfoundState.to.charAt(0) === '/';
      var pathPartsArray = unfoundState.to === '/'
        ? baseState
        : isPath
        ? baseState.concat(unfoundState.to.replace(/^\/|\/$/g,'').split('/'))
        : unfoundState.to.split('.'); // assume state name

      var validParts = [];
      var validStateNames = [];
      var normedStates = [];
      var normedStatesToLoad = [];

      pathPartsArray.forEach(function (part,i) {
        var stateName = validParts.concat(part).join('.')
        var norm = normedModules[stateName];
        if(norm){
          norm.parentStateName = validParts.join('.');
          validParts.push(part);
          validStateNames.push(stateName);
          normedStates.push(norm);
          if(!$state.get(norm.stateName)){
            normedStatesToLoad.push(norm);
          }
        }
      });

      return s.p.each(normedStatesToLoad,function (norm,i) {
        s._.delay(function () {
          if(!norm.urlMatcher){
           throw new Error('State transition failed. Did you run addState in '+norm.modulePath+'.js?');
          }
        },2000);
        return s.loadSandbox(norm.moduleKey).then(function(){
          console.log('loaded state',norm.moduleKey);
          var parent = normedModules[norm.parentStateName] || {stateAbsoluteUrlPattern:'/'};
          var parentState = $state.get(norm.parentStateName);
          norm.stateAbsoluteUrlPattern = parent.stateAbsoluteUrlPattern + $state.get(norm.stateName).url + '/';
          norm.urlMatcher = $urlMatcherFactory.compile(norm.stateAbsoluteUrlPattern);
          return norm;
        })
      })
      .then(function () {
        var norm = normedStatesToLoad[normedStatesToLoad.length-1];
        // need to reset TOPARAMS here because the state resets to the last
        // known state before this .then() block runs, resetting the url
        // back to its previous state before the new state's params get passed
        TOPARAMS = (isPath ? norm.urlMatcher.exec(unfoundState.to) : unfoundState.toParams);
        $state.transitionTo(norm.stateName, TOPARAMS, {reload:false,notify:true,location:true,inherit:false});
      })
      .catch(function (err) {
        console.log('loadModules err',err);
      })
    });
  }]);

  s.on('goToState',function (envelope) {
    // whiteList(envelope,/^sections/);
    var $state = INJECTOR.get('$state');
    if(!s._.isArray(envelope.data)){
      throw new Error('goToState requires an array');
    }
    $state.transitionTo.apply($state,envelope.data);
  });

  s.on('$window',function (envelope) {return INJECTOR.get('$window'); });
  s.on('$location',function (envelope) {return INJECTOR.get('$location'); });
  s.on('$compile',function (envelope) {return INJECTOR.get('$compile'); });
  s.on('stateName',function (envelope) {return TOSTATE.name; });
  s.on('stateParams',function (envelope) {return TOPARAMS; });

  s.on('httpInterceptor',function (envelope) {
    app.factory(envelope.data.name,function () {
      return envelope.data.httpInterceptors;
    });
    HTTPPROVIDER.interceptors.push(envelope.data.name);
  });

  s.on('addState',function (envelope) {
    var norm = normedModules[envelope.source];
    if(norm.moduleKey.indexOf('states') !== 0){
      throw new Error('addState only works in statess');
    }
    envelope.data.state = envelope.data.state || {};

    var stateObj = {};
    if(envelope.data.state.overwrite){
      stateObj = envelope.data.state;
    } else {
      stateObj.name = norm.stateName;
      stateObj.templateUrl = norm.templateUrl;
      if(norm.directoryUrl){
        stateObj.url = norm.directoryUrl.replace(/^.*\//,'') + '/';
        if(envelope.data.stateParams){
          stateObj.url += (envelope.data.stateParams+'/')
        }
      }
      stateObj.abstract = envelope.data.state.abstract;
      stateObj.controllerAs = norm.camelCased;
      if(envelope.data.controller){
        stateObj.controller = function(resolutions,$scope){
          // temporary workaround to enable broadcast/emit until it's hooked into messaging.
          this.msgAncestors = function (str,data,options) {
            $scope.$emit.call($scope,str,data);
          }
          this.msgDescendents = function (str,data,options) {
            $scope.$broadcast.call($scope,str,data);
          }
          this.on = function () {
            $scope.$on.apply($scope,arguments);
          };
          $scope.$on('$destroy',function () {
            delete this.on;
            delete this.msgAncestors;
            delete this.msgDescendents;
          });
          envelope.data.controller.call(this,resolutions);
        };
      }
      stateObj.resolve = {
        resolutions:function () {
          if(envelope.data.resolve){return envelope.data.resolve();}
        }
      };
    }
    STATEPROVIDER.state(stateObj);
  },{},{passEnvelope:true});

  s.on('componentDirective',function (data) {
    var norm = window._sandboxConfig.normedModules[envelope.source];
    COMPILEPROVIDER.directive(norm.camelCased,function(){
      var directiveDefinitionObj = {
        require:envelope.data.require,
        replace:false,
        transclude:false,
        restrict:'E',
        scope:true,
        bindToController:true,
        controller:envelope.data.controller,
        controllerAs:norm.camelCased,
        compile: function compile(tElement, tAttrs, transclude) {
          if(envelope.data.compile){
            envelope.data.compile.call(this,tElement,tAttrs);
          }
          var args = {};
          if(envelope.data.preLink){
            args.pre = function (scope, iElement, iAttrs, controller) {
              return envelope.data.preLink.apply(this,arguments);
            }
          }
          if(envelope.data.postLink){
            args.post = function (scope, iElement, iAttrs, controller) {
              return envelope.data.postLink.apply(this,arguments);
            }
          }
          return args;
        },
      };
      envelope.data.template ?
        (directiveDefinitionObj.template = envelope.data.template):
        (directiveDefinitionObj.templateUrl = norm.templateUrl);
      return directiveDefinitionObj;
    });
  },{},{passEnvelope:true});

  s.on('decoratorDirective',function (envelope) {
    var norm = normedModules[envelope.source];
    console.log('in decoratorDirective');
    COMPILEPROVIDER.directive(envelope.data.name,function(){
      var directiveDefinitionObj = {};
      return {
        replace:false,
        transclude:false,
        restrict:'A',
        require:envelope.data.require,
        scope:false,
        controller:envelope.data.controller,
        parsers:envelope.data.parsers,
        formatters:envelope.data.formatters,
        validators:envelope.data.validators,
        compile: function compile(tElement, tAttrs, transclude) {
          if(envelope.data.compile){
            envelope.data.compile.apply(this,tElement,tAttrs);
          }
          var args = {};
          if(envelope.data.preLink){
            args.pre = function (scope, iElement, iAttrs, controller) {
              return envelope.data.preLink.apply(this,arguments);
            }
          }
          if(envelope.data.postLink){
            args.post = function (scope, iElement, iAttrs, controller) {
              return envelope.data.postLink.apply(this,arguments);
            }
          }
          return args;
        },
      }
    });
  },{},{passEnvelope:true});

  s.addSandboxMethods(function(config){
    return {
      rq:function(msg,data,options){
        var response = INJECTOR.get(msg);
        return response ? s.p(response) : s.msg(msg,data,options);
      }
    };
  });

  // manually bootstrap our angular app
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });
});