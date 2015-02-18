module.exports = {
  app: {
    files: [{
      dot: true,
      src: '<%= files.app.compiled_src %>'
    }]
  },
  plans:{
    files: [{
      dot: true,
      src: '<%= dirs.dist.plans %>'
    }]
  }
};
