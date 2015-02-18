module.exports = {
  options: {
    port: 9000,
    // change this to '0.0.0.0' to access the server from outside
    hostname: 'localhost',
    base: '<%= dirs.app %>'
  },
  nowatch:{
    options: {
      open: false
    }
  },
  livereload: {
    options: {
      livereload: true,
      open: false
    }
  }
};
