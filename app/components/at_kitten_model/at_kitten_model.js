sandbox(function (s) {
  return s.rq('request components.at_collection.init',{
    name:'kitten',
    modelDefaults:{
      name:'',
      age:'',
      sound:'meow',
      color:'',
      id:null
    }
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
