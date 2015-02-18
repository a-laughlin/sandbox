module.exports = {
  app: {
    src: '<%= dirs.app %>index_preprocess.html',
    dest: '<%= dirs.app %>index.html',
    options: {
      styles: {
        vendor: '<%= files.app.vendor_css %>',
        // vendor: '<%= files.app.compiled_vendor_css %>',
        css: '<%= files.app.compiled_css %>'
      },
      scripts: {
        head: '<%= files.app.js_head_scripts %>',
        vendor: '<%= files.app.vendor_js %>',
        templates:'<%= files.app.compiled_templates %>',
        // js_modules: '<%= files.app.js_modules %>',
        // js_module_utils: '<%= files.app.js_module_utils %>'
      }
    }
  }
};
