(function (win) {
  var config = win._sandboxConfig;
  var modules = {};
  win.sandbox = function(fn){
    return define(['sandbox','module'],function(sbox,module){
      var _,window,angular,P,Promise,$;
      var prom = fn(modules[module.id].sandbox);
      if(prom && prom.then){
        return prom.then(function (data) {
          modules[module.id].dfd.resolve(data);
          return data;
        });
      }
      return modules[module.id].dfd.resolve();
    });
  };

  var appReqs = ['lodash','bluebird','postal'];
  if(!Object.create){appReqs.push('es5-shim','es5-sham');}// for IE8
  define(appReqs, function(lodash,bluebird,postal){
    bluebird.longStackTraces();
    function Sandbox(){}

    Sandbox.prototype = {
      '_':lodash, // provide lodash utilities
      'p':bluebird, // provide promise utilities
      msg:function (msgStr,data,options) {
        var envelope = {source:this._name,topic:msgStr, data:data, options:options||{} };
        var moduleKey = config.onAsyncMap[msgStr] || msgStr;
        if(modules[moduleKey]){
          return modules.app.sandbox.loadSandbox(moduleKey).then(function () {
            envelope.options.dfd = bluebird.pending();
            postal.publish(envelope);
          });
        }
        return bluebird.resolve(postal.publish(envelope));
      },
      on:function (msgStr,fn,params,options) {
        if(!fn){throw new error('fn required in on()');}
        var envelope = {
          topic:msgStr,
          data:params,
          options:options||{},
          source:this._name,
          callback: function(data,env){
            if(!env){ throw data; } // "data" is actually error here in postal.js speak
            if(envelope.options.passEnvelope){
              if(env.options.dfd){ return env.options.dfd.resolve(fn(env)); }
              return fn(env);
            }
            if(env.options.dfd){ return env.options.dfd.resolve(fn(data)); }
            return fn(data);
          }
        };
        return postal.subscribe(envelope);
      },
      onAsync:function (msgStr,fn,params,options) {
        return this.on(msgStr,fn,params,options);
      },
      rq:function(msg,data,options){
        return this.msg(msg,data,options)
      }
    };

    function Module(moduleName){
      this.state = 'defined';
      this.sandbox = new Sandbox();
      this.sandbox._name = moduleName;
      this.dfd = bluebird.pending();
    }

    lodash.forIn(config.paths,function (path,id) {
      modules[id] = new Module(id);
    });

    modules.app.sandbox.loadSandbox = function(name,params){
      if(!modules[name]){
        throw new Error('no sandbox named '+name+'. Did you create one?');
      }
      if(modules[name].state === 'defined'){
        modules[name].state = 'requested';
        require([name],function(){});
      }
      return modules[name].dfd.promise;
    };
    modules.app.sandbox.addSandboxMethods = function(fn){
      var obj = fn(win._sandboxConfig);
      for (var method in obj){
        Sandbox.prototype[method] = this.p.method(obj[method]);
      }
    };
    var msgInterceptor;
    var onInterceptor;
    modules.app.sandbox.setMsgInterceptor = function(fn){msgInterceptor = fn; };
    modules.app.sandbox.setOnInterceptor = function(fn){onInterceptor = fn; };
  });
})(window);
