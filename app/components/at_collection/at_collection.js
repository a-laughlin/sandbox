sandbox(function (s) {

  /**
   * init: returns a new collection
   * params include:
   *   modelDefaults:  any default properties to set on models
   * returns a new collection
   */
  var collectionStorage = {};
  s.on('init',function initCollection(params) {
    if(!params.name){throw new Error('collections require a name'); }
    if(collectionStorage[params.name]){
      return collectionStorage[params.name];
    }

    // Define model
    function Model(){}
    Model.prototype = {
      _changeState:'pristine',
      _syncState:'pristine',
      _fnExecutionState:'idle'
    };

    var ID = params.idAttribute || 'id';
    var collection = [];
    collection._changeState = 'pristine',
    collection._syncState = 'pristine',
    collection._fnExecutionState = 'idle',
    collection._modelsById = {},
    collection.addMethod = function (name,fn) {addMethod(collection,name,fn); },
    collection.addModelMethod = function (name,fn) {addMethod(Model.prototype,name,fn); },
    collection.push = function (arr) {
      (s._.isArray(arr) ? arr : [arr]).forEach(function (obj) {
        initModel(collection,Model,ID,params.modelDefaults,obj);
      });
      return this;
    };

    // no adapter means no read/write methods. Return the collection.
    if(!params.adapter){return collection;}

    /**
     * read: updates the collection' from the server
     * @param  {Number or Object or undefined}  id
     * @return {collection}
     */
    collection.addMethod('read',function (idOrObj) {
      var opts = getOpts(idOrObj,ID);

      this._syncState = 'reading';
      return params.adapter.get(opts).bind(this)
      .each(function (serverModel) {
        var existingModel = this._modelsById[serverModel[ID]];
        if (!existingModel){
          existingModel = initModel(collection,Model,ID,params.modelDefaults,serverModel);
        }
        s._.merge(existingModel._serverModel,serverModel);
        return existingModel;
      })
      .then(function () {
        this._syncState = 'idle';
        s.msg('models.read',s._.pluck(this,ID));
        return this;
      });
    });

    /**
     * remove an object
     * @param {any} idOrObj see the getOpts fn
     */
    collection.addMethod('remove',function (idOrObj) {
      var opts = getOpts(idOrObj,ID);
      var model = this._modelsById[opts[ID]];
      if(!model){
        throw new Error('No model to remove with id: '+ opts[ID]);
      }
      model.destroy_model = true;
      return this.write(model);
    });


    /**
     * write: writes any changes to the server
     * passing nothing writes all changed/new models in the collection
     * passing a model id number writes that model if it has changes
     * passing an object with properties filters the collection for models with
     *   matching properties, then writes any changed/new models
     * if destroy_model === true on any model, it will be removed
     */
    collection.addMethod('write',function (idOrObj) {
      var opts = getOptsArray(idOrObj,ID);
      this._syncState = 'writing';

      var toWrite = {
        changed:{method:'patch',arr:[]},
        created:{method:'post',arr:[]},
        removed:{method:'remove',arr:[]}
      };
      var keepIds = [];
      s._.where(s._.values(collection._modelsById),opts)
      .forEach(function (model) {
        if(model.destroy_model === true) {return toWrite.removed.push(changesObj)};
        if (!(ID in model._serverModel)) {return toWrite.created.push(changesObj)};
        setModelChanges(model);
        var changesObj = s._.pick(model,model.changes);
        toWrite.changed.push(changesObj);
      });

      var key;
      for (key in toWrite){
        if(toWrite[key].arr.length === 0){continue;}
        toWrite[key] = params.adapter[toWrite[key].method](toWrite[key].arr);
      }

      return s.p.props(toWrite).bind(this)
      .then(function (props) {
        this._syncState = 'idle';
        // need code to remove models from collection and _modelsById
        for (key in props){
          s.msg('models.'+key,s._.pluck(props[key],ID));
        }
        return this;
      });
    });

    return collection;
  });




  /**
   * Utility methods
   */

  /**
   * enable adding chainable sync and async functions to an object
   * @param {Object}   target             model or collection
   * @param {String}   fnName             function's name
   * @param {Function} fn                 function to bind to model/collection
   *
   * @return {undefined}
   * note: functions added through it return "this"
   */
  function addMethod(target,fnName,fn){
    target[fnName] = function () {
      var self = this;
      if(self._fnExecutionState === 'idle' ){
        self._fnExecutionState = 'executing';
        var dfd = s.p.pending();
        self.promise = dfd.promise;
        s._.defer(function () {
          self.promise = s.p.reduce(self._fnQueue,function (result,fn,i) {
            return fn.apply(self,self._fnArgs[i]);
          },self)
          .then(function () {
            self._fnExecutionState = 'idle';
            return dfd.resolve(self);
          });
        });
        self._fnArgs = [];
        self._fnQueue = [];
      }
      self._fnArgs.push(arguments);
      self._fnQueue.push(fn);
      return self;
    };
  }

  /**
   * add an object to a collection's models
   * @param {Object} collection
   * @param {Function} Model      a model constructor
   * @param {Object} defaults     any default model properties to add
   * @param {String} ID  the name of the model's id
   * @param {Object} obj          the object to convert into a model
   * @return {Object}             returns a model instance
   */
  function initModel(collection,Model,ID,defaults,obj){
    if(obj instanceof Model){
      if(!(obj[ID] < Infinity)) {throw new Error('object id must be numeric');}
      return collection._modelsById[obj[ID]] = obj;
    }
    if(typeof obj !== 'object'){
      throw new Error('collection.add requires passing object.');
    }
    obj = s._.merge(new Model(),defaults,obj);
    obj._serverModel = {};
    obj.changes = [];
    if(ID in obj){
      collection._modelsById[obj[ID]] = obj;
    }
    collection[collection.length] = obj;
    return obj;
  }

  /**
   * setModelChanges: populates model's changes array
   * @param {Model} model
   * @return undefined (populates model's changes array)
   */
  function setModelChanges(model) {
    for (var key in model) {
      if(model.hasOwnProperty(key) === false){continue;}
      if(key.charAt(0) === '_'){continue;}
      if(model[key] === model._serverModel[key]){continue;}
      model.changes.push(key);
    }
    for (key in model._serverModel) {
      if(model[key] === model._serverModel[key]){continue;}
      model.changes.push(key);
    }
  }

  /**
   * getOptsArray - standardize collection method parameters
   * @param {any} id
   * @return given a # or {id:#,...}, returns {id:#,...}, else {}
   */
  function getOpts(idOrObj,ID){
    var opts = {};
    if (idOrObj < Infinity || typeof idOrObj === 'string'){ opts[ID]=idOrObj; return opts;}
    if(s._.has(idOrObj,ID)){ opts = idOrObj; return opts;}
    return opts;
  }
});
