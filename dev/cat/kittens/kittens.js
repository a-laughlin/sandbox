sandbox(function (s) {
  s.msg('addState',{
    // resolve:function ($stateData) {
      // return s.rq('kitten_collection',{id:$stateData.params.kittenId})
    // },
    controller:function (catCollection) {
      console.log('kitten collection');
      // s._.assign(this,catCollection.modelsArray);
    }
  });
})
