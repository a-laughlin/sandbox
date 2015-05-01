module.exports = {

  app: {
    src: '<%= files.app.templates %>',
    dest: '<%= files.app.compiled_templates %>',
    options: {
      // custom options, see below
      base:'<%= dirs.app %>'
    },
  },
  dist:{
    options: {
      // custom options, see below
      base:'<%= dirs.dist %>'
    },
  },
};
