module.exports = {
  baseUrl:'',
  deps:['app'],
  paths:{
    'app':'<%= dirs.app %>app.js',
    'sandbox':'<%= dirs.app %>sandbox.js',
    'compiled-templates':'<%= files.app.compiled_templates %>',
    'jquery':'<%= dirs.bower %>jquery/dist/jquery.js',
    'lodash':'<%= dirs.bower %>lodash/lodash.js',
    'angular':'<%= dirs.bower %>angular/angular.js',
    'angular-ui-router':'<%= dirs.bower %>angular-ui-router/release/angular-ui-router.js',
    'bluebird':'<%= dirs.bower %>bluebird/js/browser/bluebird.js',
    'postal':'<%= dirs.bower %>postal.js/lib/postal.js',
    'angular-mocks':'<%= dirs.bower %>angular-mocks/angular-mocks.js',
    'es5-shim':'<%= dirs.bower %>es5-shim/es5-shim.js',
    'es5-sham':'<%= dirs.bower %>es5-shim/es5-sham.js'
  },
  map:{
    '*': {
      'underscore': 'lodash'
    }
  },
  shim: {
    'angular':{deps:['jquery'],exports:'angular'},
    'lodash':{exports:'_'},
    'bluebird':{exports:'P'},
    'compiled-templates': {deps: ['angular'] },
    'angular-ui-router': {deps: ['angular'] },
    'angular-mocks': {deps: ['angular'] },
    'postal': {exports: 'postal' },
    'app':{
      deps:[
        'sandbox',
        'angular-mocks',
        'compiled-templates',
        'angular',
        'postal',
        'angular-ui-router',
      ]
    }
  }
};
