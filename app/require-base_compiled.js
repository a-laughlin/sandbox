requirejs.config({
  "baseUrl": "",
  "deps": [
    "app"
  ],
  "paths": {
    "app": "app",
    "sandbox": "sandbox",
    "compiled-templates": "templates_compiled",
    "jquery": "bower/jquery/dist/jquery",
    "lodash": "bower/lodash/lodash",
    "angular": "bower/angular/angular",
    "angular-ui-router": "bower/angular-ui-router/release/angular-ui-router",
    "bluebird": "bower/bluebird/js/browser/bluebird",
    "postal": "bower/postal.js/lib/postal",
    "angular-mocks": "bower/angular-mocks/angular-mocks",
    "es5-shim": "bower/es5-shim/es5-shim",
    "es5-sham": "bower/es5-shim/es5-sham",
    "components.at_cat_model": "components/at_cat_model/at_cat_model",
    "components.at_collection": "components/at_collection/at_collection",
    "components.at_http": "components/at_http/at_http",
    "components.at_kitten_model": "components/at_kitten_model/at_kitten_model",
    "components.at_simple": "components/at_simple/at_simple",
    "sections.cat": "sections/cat/cat",
    "sections.cat.kittens": "sections/cat/kittens/kittens",
    "sections.simple": "sections/simple/simple"
  },
  "shim": {
    "angular": {
      "deps": [
        "jquery"
      ],
      "exports": "angular"
    },
    "lodash": {
      "exports": "_"
    },
    "bluebird": {
      "exports": "P"
    },
    "compiled-templates": {
      "deps": [
        "angular"
      ]
    },
    "angular-ui-router": {
      "deps": [
        "angular"
      ]
    },
    "angular-mocks": {
      "deps": [
        "angular"
      ]
    },
    "postal": {
      "exports": "postal"
    },
    "app": {
      "deps": [
        "sandbox",
        "angular-mocks",
        "compiled-templates",
        "angular",
        "postal",
        "angular-ui-router"
      ]
    }
  },
  "map": {
    "*": {
      "underscore": "lodash"
    }
  }
});