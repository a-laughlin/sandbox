module.exports = {
  app: {
    options:{
      baseFile:'./config/requirejs/base.js'
    },
    files:[
      {
        src:'<%= files.app.js_modules %>',
        dest:'<%= dirs.app %>require-base_compiled.js'
      }
    ]
  }

  // plans:{},
  // contacts:{},
  // reports:{},
  // analyses:{},
};
