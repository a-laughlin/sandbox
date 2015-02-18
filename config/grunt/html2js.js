module.exports = {
  options: {
    // custom options, see below
    base:'<%= dirs.app %>'
  },
  dashboard: {
    src: '<%= files.app.templates %>',
    dest: '<%= files.app.compiled_templates %>'
  },
  registration:{},
};
