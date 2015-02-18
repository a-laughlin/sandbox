sandbox(function(s){
  var app = angular.module('app', ['ui.router']);
  var COMPILEPROVIDER; // so we can lazy-define directives
  var STATEPROVIDER; // ditto for states
  var INJECTOR;
  var HTTPPROVIDER;
  var TOSTATE;
  var TOPARAMS;
  var stateCreatedInTime;
  var DEBUG = false;
  s.modulePaths = requirejs.s.contexts._.config.paths;


  /**
   * app wide naming standardization
   */
  var normedModules ={
    byModulePathKey:{},
    byStateName:{},
    byModulePath:{},
    byUrl:{}
  };

  s._.forOwn(s.modulePaths,function (path,key) {
    if(!/^(components|sections)/.test(path)){return;}
    var normalized = {};
    if(path.indexOf('section')===0){
      normalized.stateName = key.replace(/^sections/,'app'); // plans.manage
      normalized.stateUrl = path.replace(/^sections\/.+\/(.+?)$/,'$1/'); // /plans/manage/
      normalized.url = path.replace(/^sections(\/.+\/).+?$/,'$1');
      normalized.directiveName = s._.camelCase(key.replace(/^sections/,'app')); // sections/plans/manage/manage_module
      normedModules.byStateName[normalized.stateName] = normalized;
      normedModules.byUrl[normalized.url] = normalized;
    } else {
      normalized.directiveName = s._.camelCase(key.replace(/^components\./,'')); // sections/plans/manage/manage_module
    }
    normalized.moduleKey = key; // plans.manage
    normalized.modulePath = path; // sections/plans/manage/manage_module
    normalized.templateUrl = normalized.modulePath + '.tpl.html';
    normedModules.byModulePathKey[normalized.moduleKey] = normalized;
    normedModules.byModulePath[normalized.modulePath] = normalized;
  });

  // get a normalized/standardized module
  function normalizedModule(input){
    for(var key in normedModules){
      if(normedModules[key][input]){
        return normedModules[key][input];
      }
    }
    throw new Error('no module exists with key,path,url,or state.name: '+input);
  }

  /**
   * angular module config() phase
   * All it does is handle route and state creation.
   */
  app.config(['$stateProvider','$urlRouterProvider','$compileProvider',
  function ($stateProvider,$urlRouterProvider,$compileProvider,$httpProvider) {
    COMPILEPROVIDER = $compileProvider;
    HTTPPROVIDER = $httpProvider;
    STATEPROVIDER = $stateProvider;
    $stateProvider.state({
      name:'app',
      url:'/',
      controller:function ($state) {
        this.states = normedModules.byStateName;
      },
      controllerAs:'app',
      templateUrl:'app.tpl.html'
    });

    // ensure we always have a trailing slash
    $urlRouterProvider.rule(function ensureTrailingSlash ($injector, $location) {
      var path = $location.url();
      if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {return;}
      if (path.indexOf('?') > -1) {return path.replace('?', '/?'); }
      return path + '/';
    });

    // when route isn't found,
    var loadedSections = {};
    $urlRouterProvider.otherwise(function lazyLoadState($injector, $location) {
      var norm = normalizedModule($location.path());
      stateCreatedInTime = false;
      setTimeout(function () {
        if(stateCreatedInTime !== false){ return;}
        throw new Error('must create a componentDirective in module: ' + norm.moduleKey);
      },1000);
      // ensure we load all parent states before trying to load a child
      var statesToLoad = [];
      if(loadedSections[norm.stateName]){
        statesToLoad.push(s.msg('request '+key,{},{internal:true}));
      } else {
        norm.stateName.split('.').slice(1).reduce(function (result,next) {
          var res = result + '.' + next;
          loadedSections[res]=true;
          statesToLoad.push(s.loadSandbox(res));
          return res;
        },'sections');
      }
      s.p.all(statesToLoad)
      .then(function () {
        $injector.get("$state").go(norm.stateName,$location.search());
      })
      .catch(function (err) {
        console.error('module not loaded - need to redirect',err);
      });
    });
  }]);

  /**
   * angular module run() phase
   */
  app.run(['$rootScope', '$location','$injector',function($rootScope,$location,$injector){
    INJECTOR = $injector;
    // enable rootscope digests on promise resolution, as $q does
    // see: https://github.com/angular/angular.js/blob/master/src/ng/q.js#L219
    // We may be able to improve performance by only activating digests on the
    // calling sandbox, but we don't need the extra performance right now.
    s.p.setScheduler(function (cb) {
      $rootScope.$evalAsync(cb);
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      TOSTATE = toState;
      TOPARAMS = toParams;
      console.log('$stateChangeStart to '+toState.name+' from '+fromState.name+' - fired when the transition begins.');
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams,err){
      console.log('$stateChangeError - fired when an error occurs during transition.');
      console.log.apply(console,arguments);
      if (err){throw err; }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeSuccess to '+toState.name+' from '+fromState.name+' - fired once the state transition is complete.');
    });
    var loadedSections = {};
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
      console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
      event.preventDefault();
      debugger;

      var nextPathObj = normalizedModule(unfoundState.to);
      $location.path(nextPathObj.url);
      $rootScope.$digest();
    });
  }]);


  // simple debug logger
  function logMsg(){
    var start = window.indexLoadTime;
    var end = (new Date(envelope.timeStamp)).getTime();
    var time = end - start;
    var e = s._.omit(envelope,timeStamp);

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
  // setMsgInterceptor defines a function to intercept all s.msg() calls
  // It works for now. Long term, it needs a more robust implementation.
  s.setMsgInterceptor(function(envelope){
    if(DEBUG){logMsg(envelope)};
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
    if(DEBUG){logMsg(envelope)};
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

  // adds a new state.
  function addState (envelope,normedModule) {
    stateCreatedInTime = true;
    envelope.data.state = envelope.data.state || {};

    var stateObj = {};
    if(envelope.data.state.overwrite){
      stateObj = envelope.data.state;
    } else {
      stateObj.name = normedModule.stateName;
      stateObj.templateUrl = normedModule.templateUrl;
      stateObj.url = normedModule.stateUrl + (envelope.data.stateParams || '');
      stateObj.abstract = envelope.data.state.abstract;
      stateObj.controllerAs = normedModule.directiveName;

      if(envelope.data.controller){
        stateObj.controller = function(resolutions){
          envelope.data.controller.call(this,resolutions);
        };
      }
      stateObj.resolve = {
        resolutions:function ($state,$stateParams) {
          var stateObj = {
            'toStateName':TOSTATE.name,
            'params': s._.transform(TOPARAMS,function(result,val,key){
              result[key] = val <= Infinity ? val/1 : val;
            })
          };

          return envelope.data.resolve ? envelope.data.resolve(stateObj): stateObj;
        }
      };
    }
    STATEPROVIDER.state(stateObj);
  }

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
      var $state = INJECTOR.get('$state')
      $state.go(envelope.data);
      // $state.go(envelope.data,$state.$current.params,{reload:true});
    },
    '$compile':function (envelope) {
      return INJECTOR.get('$compile');
      // $state.go(envelope.data,$state.$current.params,{reload:true});
    },
    '$httpBackend':function (envelope) {
      whiteList('components.at_mock_backend');
      return INJECTOR.get('$httpBackend');
      // $state.go(envelope.data,$state.$current.params,{reload:true});
    },
    httpInterceptor:function (envelope) {
      app.factory(envelope.data.name,function () {
        return envelope.data.httpInterceptors;
      });
      HTTPPROVIDER.interceptors.push(envelope.data.name);
    },
    componentDirective:function (envelope) {
      var norm = normalizedModule(envelope.source);
      if(norm.moduleKey.indexOf('section')=== 0){
        // create a state that acts like a directive
        return addState(envelope,norm);
      }
      COMPILEPROVIDER.directive(norm.directiveName,function(){
        var directiveDefinitionObj = {
          require:envelope.data.require,
          replace:true,
          transclude:false,
          restrict:'E',
          scope:true,
          bindToController:true,
          controller:envelope.data.controller,
          controllerAs:norm.directiveName,
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
    generatorDirective:function (envelope) {
      var norm = normalizedModule(envelope.source);

      console.log('generatorDirective',arguments);
      COMPILEPROVIDER.directive(envelope.data.name,function(){
        var directiveDefinitionObj = {};
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
      var norm = normalizedModule(envelope.source);
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

  // manually bootstrap our angular app
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });
});
