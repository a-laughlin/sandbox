sandbox(function (s) {
  s.msg('addState',{
    controller:function () {
      console.log('simple state controller');
      this.statement = 'hi';//simpleMessage;
    }
  });
});
