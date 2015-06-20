sandbox(function (s) {
  return s.msg('request components.at_http.adapter',{path:'mock/kitten/'})
  .then(function (mockAdapter) {
    return s.msg('request components.at_collection.init',{
      name:'kitten',
      adapter:mockAdapter,
      modelDefaults:{
        name:'',
        age:'',
        sound:'meow',
        color:'',
        id:null
      }
    });
  })
  .then(function (kittenCollection) {
    s.on('kitten_collection',function (params) {
      return kittenCollection.read(params).promise
      .then(function (kittens) {
        return kittens;
      });
    });
  });
});
