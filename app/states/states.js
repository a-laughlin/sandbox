sandbox(function (s) {
  s.msg('addState',{
    resolve:function ($stateData) {
      console.log('states.js resolve');
    },
    controller:function () {
      console.log('states.js controller');
      var self = this;
      self.states = [];
      _.forIn(window._sandboxConfig.normedModules,function(val,key){
        if(key.indexOf('states')>-1){self.states.push(val)}
      });
    }
  });
});
