// sandbox(function (s) {
//   s.msg('componentDirective',{
//     // resolve:function () {
//     //   return s.msg('request components.simple.hi'); // request the component
//     // },
//     controller:function(){
//       this.statement = 'hi';//simpleMessage;
//     }
//   });
// });
sandbox(function (s) {
  s.msg('componentDirective',{
    controller:function () {
      this.statement = 'hi';//simpleMessage;
    }
  });
});
