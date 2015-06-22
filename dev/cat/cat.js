sandbox(function (s) {
  s.msg('addState',{
    stateParams:':catId',
    // resolve:function ($stateData) {
    //   return s.msg('request components.at_cat_model.cat_collection')
    // },
    controller:function (catCollection) {
      console.log('catcontroller');
      // catCollection.push({
      //   name:'fluffy',
      //   color:'calico',
      //   sound:'meow'
      // });
      // this.cat = catCollection[0];
    }
  });
});
