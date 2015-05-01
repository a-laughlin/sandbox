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

    // ensure we always have a trailing slash
    $urlRouterProvider.rule(function ensureTrailingSlash ($injector, $location) {
      var path = $location.url();
      if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {return;}
      if (path.indexOf('?') > -1) {return path.replace('?', '/?'); }
      return path + '/';
    });

    // when route isn't found,
    $urlRouterProvider.otherwise(function ($injector,$location) {
      console.log('$urlRouterProvider.otherwise',$location.url());
      $injector.get('$state').transitionTo($location.url(),{},{reload:false,inherit:false,notify:false,location:false});
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

      var isPath = unfoundState.to.charAt(0) === '/';
      var pathPartsArray = isPath
        ? ['states'].concat(unfoundState.to.replace(/^\/|\/$/g,'').split('/'))
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
          var parent = normedModules[norm.parentStateName] || {stateAbsoluteUrlPattern:''};
          var parentState = $state.get(norm.parentStateName);
          norm.stateAbsoluteUrlPattern = parent.stateAbsoluteUrlPattern + $state.get(norm.stateName).url;
          norm.urlMatcher = $urlMatcherFactory.compile(norm.stateAbsoluteUrlPattern);
          return norm;
        });
      })
      .then(function () {
        var norm = normedStatesToLoad[normedStatesToLoad.length-1];
        // need to reset TOPARAMS here because the state resets to the last
        // known state before this .then() block runs, resetting the url
        // back to its previous state before the new state's params get passed
        TOPARAMS = (isPath ? norm.urlMatcher.exec(unfoundState.to) : unfoundState.toParams);
        $state.transitionTo(norm.stateName, TOPARAMS, {reload:false,notify:true,location:true,inherit:false});
      })
    });
  }]);


  // simple debug logger
  function logMsg(envelope){
    var start = window.indexLoadTime;
    var end = (new Date()).getTime();
    var time = end - start;
    var e = s._.merge({},envelope);

    var dataMsg = typeof e.data === 'function' ? 'function' : e.data;
    if(dataMsg && dataMsg.channel){
      dataMsg.data ?
        console.log(time,dataMsg.channel + ' on:' + dataMsg.topic + ' with params: ',dataMsg.data):
        console.log(time,dataMsg.channel + ' on:' + dataMsg.topic);
    }
    else {
      if(dataMsg === 'function'){
        throw new Error('cannot pass functions to messages');
      }
      if(e.options.requestDfd){
        e.options.requestDfd.promise.then(function (resolutionData) {
          console.log(time,e.channel+' response to: '+e.topic,resolutionData);
        });
      } else {
        console.log(time,e.channel+' msg from '+e.source+': '+e.topic,dataMsg);
      }
    }
  }

  var publishTo = {
    all:function(envelope){
      s._.forIn(normedModules,function (module,key) {
        s.msg(envelope.topic,envelope.data,{channel:key});
      });
    },
    ancestors:function(){},
    descendents:function(){}
  }

  // setMsgInterceptor defines a function to intercept all s.msg() calls
  // It works for now. Long term, it needs a more robust implementation.
  s.setMsgInterceptor(function(envelope){
    // app should be able to publish across all directories
    // app should be able to publish a message a specific directory
    // app should be able to receive a request and redirect it to the appropriate channel
    // sandbox should be able to publish up through parent directories
    // sandbox should be able to publish directly to app
    // sandbox should be able to publish internally, bypassing app
    // app should be able to publish internally
    //
    if(DEBUG && DEBUG.test(envelope.topic)){logMsg(envelope)};
    envelope.channel = 'app';
    if(envelope.source === 'app'){
      if(!envelope.options.channel){
        envelope.options.cancel = true;
        return;
      }
      envelope.channel = envelope.options.channel;// enable app to publish in other sandboxes
    } else {
      if(envelope.options.internal){ // enable sandboxes' internal messaging
        envelope.channel = envelope.source;
      }
    }
    if(msgParsers[envelope.topic]){
      envelope.options.cancel = true;
      s.msg('msgParsers caught: '+envelope.topic,envelope.data,{cancel:true});
      return msgParsers[envelope.topic](envelope);
    }

    if(envelope.topic.indexOf('request ') !== 0){
      // handle redirecting to the appropriate channel
      if (publishTo[envelope.options.to]){
        envelope.options.cancel=true;
        publishTo[envelope.options.to](envelope);
      }
      return true;
    }

    var topicName = envelope.topic.slice(8);
    if(msgParsers[topicName]){
      envelope.options.cancel = true;
      s.msg('msgParsers caught: '+topicName,envelope.data,{cancel:true});
      return envelope.options.promise = msgParsers[topicName](envelope);
    }
    // if request lacks specific item, just load the sandbox
    if(s.modulePaths[topicName]){
      envelope.options.promise = s.loadSandbox(topicName)
      .then(function (args) {
        return args;
      });
      return envelope.options.promise;
    }
    // continue with loading the module and requesting something from it
    var argPos = topicName.lastIndexOf('.');
    if(argPos === -1){throw new Error('no module with name '+topicName+ ' exists.'); }
    var requestedItem = topicName.slice(argPos+1);
    var moduleName = topicName.slice(0,argPos);
    var newOptions = {requestDfd:s.p.pending(),channel:moduleName};
    envelope.options.promise = newOptions.requestDfd.promise;
    s.loadSandbox(moduleName)
    .then(function () {
      s.msg(requestedItem,envelope.data,newOptions);
    });
    return envelope.options.promise;
  });

  // intercept all calls to s.on
  s.setOnInterceptor(function (envelope,fn) {
    if(DEBUG && DEBUG.test(envelope.topic)){logMsg(envelope)};
    envelope.callback = function(data,env){
      if(!env){
        throw data;// "data" is actually error here in postal.js speak
      }
      if(env.options.requestDfd){
        return env.options.requestDfd.resolve(fn(data));
      }
      return fn(data);
    }
  });

  // simple whitelisting for who can make requests
  function whiteList(envelope,moduleName){
    if(envelope.source !== moduleName){
      throw new Error(envelope.source + ' may not request '+ envelope.topic + '. Try '+ moduleName + '.');
    }
  }

  var msgParsers = {
    '$http':function (envelope) {
      whiteList(envelope,'components.at_http');
      return INJECTOR.get('$http');
    },
    '$resource':function (envelope) {
      whiteList(envelope,'components.at_http');
      return INJECTOR.get('$resource');
    },
    '$location':function (envelope) {
      whiteList(envelope,'components.at_location');
      return INJECTOR.get('$location');
    },
    '$window':function (envelope) {
      whiteList(envelope,'components.at_location');
      return INJECTOR.get('$window');
    },
    goToState:function (envelope) {
      // whiteList(envelope,/^sections/);
      var $state = INJECTOR.get('$state');
      if(!s._.isArray(envelope.data)){
        throw new Error('goToState requires an array');
      }
      $state.transitionTo.apply($state,envelope.data);
    },
    stateName:function (envelope) {
      // whiteList(envelope,/^sections/);
      return TOSTATE.name;
    },
    stateParams:function (envelope) {
      return TOPARAMS;
    },
    '$compile':function (envelope) {
      return INJECTOR.get('$compile');
    },
    httpInterceptor:function (envelope) {
      app.factory(envelope.data.name,function () {
        return envelope.data.httpInterceptors;
      });
      HTTPPROVIDER.interceptors.push(envelope.data.name);
    },
    addState:function (envelope) {
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
        stateObj.url = norm.directoryUrl + (envelope.data.stateParams || '');
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
    },
    componentDirective:function (envelope) {
      var norm = normedModules[envelope.source];
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
    },
    templateDirective:function (envelope) {
      var norm = normedModules[envelope.source];
      console.log('in templateDirective',norm);
      COMPILEPROVIDER.directive(norm.camelCased,function(){
        return {
          // template:envelope.data.template,
          templateUrl:norm.templateUrl,
          replace:false,
          transclude:false,
          restrict:'A',
          require:envelope.data.require,
          scope:envelope.data.scope||{},
          controller:envelope.data.controller,
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
    },
    decoratorDirective:function (envelope) {
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
    }
  };
  s.addSandboxMethods(msgParsers);

  // manually bootstrap our angular app
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });
});
