sandbox(function (s) {
  s.msg('addState',{
    resolve:function ($stateData) {
      return s.msg('request components.at_kitten_model.kitten_collection',{id:$stateData.params.kittenId})
    },
    controller:function (catCollection) {
      s._.assign(this,catCollection.modelsArray);
    }
  });
})
