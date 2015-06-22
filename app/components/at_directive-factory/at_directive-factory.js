sandbox(function (s) {
  s.onAsync('componentDirective',function (data) {
    var norm = window._sandboxConfig.normedModules[envelope.source];
    COMPILEPROVIDER.directive(norm.camelCased,function(){
      var directiveDefinitionObj = {
        require:envelope.data.require,
        replace:false,
        transclude:false,
        restrict:'E',
        scope:true,
        bindToController:true,
        controller:envelope.data.controller,
        controllerAs:norm.camelCased,
        compile: function compile(tElement, tAttrs, transclude) {
          if(envelope.data.compile){
            envelope.data.compile.call(this,tElement,tAttrs);
          }
          var args = {};
          if(envelope.data.preLink){
            args.pre = function (scope, iElement, iAttrs, controller) {
              return envelope.data.preLink.apply(this,arguments);
            }
          }
          if(envelope.data.postLink){
            args.post = function (scope, iElement, iAttrs, controller) {
              return envelope.data.postLink.apply(this,arguments);
            }
          }
          return args;
        },
      };
      envelope.data.template ?
        (directiveDefinitionObj.template = envelope.data.template):
        (directiveDefinitionObj.templateUrl = norm.templateUrl);
      return directiveDefinitionObj;
    });
  },{},{passEnvelope:true});

  s.onAsync('decoratorDirective',function (envelope) {
    var norm = normedModules[envelope.source];
    console.log('in decoratorDirective');
    COMPILEPROVIDER.directive(envelope.data.name,function(){
      var directiveDefinitionObj = {};
      return {
        replace:false,
        transclude:false,
        restrict:'A',
        require:envelope.data.require,
        scope:false,
        controller:envelope.data.controller,
        parsers:envelope.data.parsers,
        formatters:envelope.data.formatters,
        validators:envelope.data.validators,
        compile: function compile(tElement, tAttrs, transclude) {
          if(envelope.data.compile){
            envelope.data.compile.apply(this,tElement,tAttrs);
          }
          var args = {};
          if(envelope.data.preLink){
            args.pre = function (scope, iElement, iAttrs, controller) {
              return envelope.data.preLink.apply(this,arguments);
            }
          }
          if(envelope.data.postLink){
            args.post = function (scope, iElement, iAttrs, controller) {
              return envelope.data.postLink.apply(this,arguments);
            }
          }
          return args;
        },
      }
    });
  },{},{passEnvelope:true});

});
