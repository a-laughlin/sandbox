sandbox(function (s) {
  s.msg('request $http')
  .then(function ($http) {

    s.on('adapter',function (params) {
      if(!params || !params.path){
        throw new Error('adapter requires use and '+params.use + 'Path');
      }
      return new Adapter(params);
    });

    function Adapter(obj){
      var self = this;
      self.idAttribute = obj.idAttribute || 'id';
      s._.merge(this,{
        custom:{},
        host:'/'
      },obj);
      ['get','patch','post','remove'].forEach(function (method) {
        self[method] = function (params,data) {
          var config = {
            method:method,
            url:self.host + self.path,
            params:params,
            data:data
          };
          if(/^mock/.test(self.path)){
            return s.p.resolve(mockMethods[method](params,data));
          }
          return s.p.resolve($http(this.custom[method] ? this.custom[method](config) : config))
          .then(function (result) {
            return s._.isArray(result.data.response) ? result.data.response : [result.data.response];
          })
          .catch(function (err) {
            console.log('adapter err',err);
          });
        }
      });
      return self;
    }

    /**
     * simple mocking
     */

    var mockIter = 1;
    function Mock (){
      this.name = 'foo';
      this.color = 'bar';
      this.id = mockIter++;
    }
    var mockData = s._.range(1,5).map(function(){return new Mock()})
    var mockMethods = {
      get:function (params) {
        return s.p.resolve('id' in params ? s._.where(mockData,params) : mockData);
      },
      patch:function (params) {
        if(!params){
          console.error('object must have an id to patch',params);
          throw new Error('object must have an id to patch');
        }
        var model = s._.find(mockData,params);
        s._.merge(model,params);
        return s.p.resolve([model]);
      },
      post:function (params) {
        var newMock = new Mock();
        mockData.push(newMock);
        return s.p.resolve([newMock]);
      },
      remove:function (params) {
        if(!params.id){
          console.error('object must have an id to remove',params);
          throw new Error('object must have an id to remove');
        }
        mockData = mockData.reject(params);
        return s.p.resolve([true]);
      }
    };

  });
});
