sandbox(function (s) {
  s.msg('componentDirective',{
    stateParams:'?catId',
    resolve:function ($stateData) {
      return s.msg('request components.at_cat_model.cat_collection')
    },
    controller:function (catCollection) {
      catCollection.push({
        name:'fluffy',
        color:'calico',
        sound:'meow'
      });
      this.cat = catCollection[0];
    }
  });
});
