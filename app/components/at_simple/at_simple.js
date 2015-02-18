sandbox(function (s) {
  s.on('hi', function () {// listen for requests to components.simple.foo
    return 'Hi!';
  });
});
