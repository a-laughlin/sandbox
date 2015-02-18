(function (win) {
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
        var envelope = {channel:this._name, source:this._name, topic:msgStr, data:data, options:options||{} };
        return modules.app.dfd.promise
        .then(function () {
          // console.log('msg',envelope);
          msgInterceptor(envelope);
          if(envelope.options.cancel) {
            return envelope.options.promise;
          }
          postal.publish(envelope);
          return envelope.options.promise;
        });
      },
      on:function (msgStr,fn,params,options) {
        if(!fn){throw new error('fn required in on()');}
        var envelope = {
          channel:this._name,
          topic:msgStr,
          data:params,
          options:options||{},
          source:this._name
        };
        onInterceptor(envelope,fn);
        if(envelope.options.cancel){
          // console.log('cancelling on',envelope);
          return;
        }
        return postal.subscribe(envelope);
      }
    };

    function Module(moduleName){
      this.state = 'defined';
      this.sandbox = new Sandbox();
      this.sandbox._name = moduleName;
      this.dfd = bluebird.pending();
    }

    lodash.forOwn(requirejs.s.contexts._.config.paths,function (path,id) {
      modules[id] = new Module(id);
    });

    modules.app.sandbox.loadSandbox = function(name,params){
      if(!modules[name]){
        throw new Error('no sandbox named'+name+'. Did you create one?');
      }
      if(modules[name].state === 'defined'){
        modules[name].state = 'requested';
        require([name],function(){},function(err){throw err;});
      }
      return modules[name].dfd.promise;
    };
    var msgInterceptor;
    var onInterceptor;
    modules.app.sandbox.setMsgInterceptor = function(fn){msgInterceptor = fn; };
    modules.app.sandbox.setOnInterceptor = function(fn){onInterceptor = fn; };
  });
})(window);
