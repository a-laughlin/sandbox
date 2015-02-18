module.exports = {
  dev: {
    files: {
      '<%= files.app.compiled_css %>':'<%= files.app.less %>',
      // '<%= files.app.compiled_vendor_css %>':[
      //   '<%= files.app.vendor_less %>',
      //   '<%= files.app.vendor_css %>'
      // ]
    }
  }
};
