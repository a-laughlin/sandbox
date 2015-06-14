{
  "baseUrl":"",
  "deps":["app"],
  "paths":{
    "app":"app",
    "sandbox":"sandbox",
    "compiled-templates":"templates_compiled",
    "jquery":"bower/jquery/dist/jquery",
    "lodash":"bower/lodash/lodash",
    "angular":"bower/angular/angular",
    "angular-ui-router":"bower/angular-ui-router/release/angular-ui-router",
    "bluebird":"bower/bluebird/js/browser/bluebird",
    "postal":"bower/postal.js/lib/postal",
    "angular-mocks":"bower/angular-mocks/angular-mocks",
    "es5-shim":"bower/es5-shim/es5-shim",
    "es5-sham":"bower/es5-shim/es5-sham",
    "angular-modelizer":"bower/angular-modelizer/dist/angular-modelizer"
  },
  "map":{
    "*": {
      "underscore": "lodash"
    }
  },
  "shim": {
    "angular":{"deps":["jquery"],"exports":"angular"},
    "lodash":{"exports":"_"},
    "bluebird":{"exports":"P"},
    "compiled-templates": {"deps": ["angular"] },
    "angular-ui-router": {"deps": ["angular"] },
    "angular-mocks": {"deps": ["angular"] },
    "postal": {"exports": "postal" },
    "angular-modelizer":{"deps": ["angular"] },
    "app":{
      "deps":[
        "sandbox",
        "angular-mocks",
        "compiled-templates",
        "angular",
        "postal",
        "angular-modelizer",
        "angular-ui-router"
      ]
    }
  }
}
