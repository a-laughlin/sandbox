module.exports = {
  dev:{
    files:{
      '<%= files.app.compiled_vendor_css %>':'<%= files.app.vendor_css %>',
      '<%= files.app.compiled_css %>':'<%= files.app.css %>',
    }
  }
};
