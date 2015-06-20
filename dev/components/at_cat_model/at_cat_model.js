sandbox(function (s) {
  return s.msg('request components.at_collection.init',{
    name:'cat',
    modelDefaults:{
      name:'cat',
      age:'',
      sound:'meow',
      color:''
    }
  })
  .then(function (catsCollection) {
    s.on('cat_collection',function () {// listen for requests to cat_collection
      return catsCollection;
    });
  });
});
