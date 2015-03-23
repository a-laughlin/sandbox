sandbox(function (s) {
  return s.msg('addState',{
    state:{
      overwrite:true,
      name:'states',
      url:'/',
      templateUrl:'states/states.tpl.html',
      controllerAs:'states',
      resolve:{
        resolutions:function  () {

        }
      },
      controller:function () {
        // console.log('states Controller 1running');
      }
    }
  });
});
