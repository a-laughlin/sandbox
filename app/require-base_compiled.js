window._sandboxConfig={
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
    "states.cat": "states/cat/cat",
    "states.cat.kittens": "states/cat/kittens/kittens",
    "states.simple": "states/simple/simple",
    "states": "states/states"
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
  "responseMap": {},
  "normedModules": {
    "components.at_cat_model": {
      "camelCased": "atCatModel",
      "moduleKey": "components.at_cat_model",
      "modulePath": "components/at_cat_model/at_cat_model",
      "templateUrl": "components/at_cat_model/at_cat_model.tpl.html"
    },
    "components.at_collection": {
      "camelCased": "atCollection",
      "moduleKey": "components.at_collection",
      "modulePath": "components/at_collection/at_collection",
      "templateUrl": "components/at_collection/at_collection.tpl.html"
    },
    "components.at_http": {
      "camelCased": "atHttp",
      "moduleKey": "components.at_http",
      "modulePath": "components/at_http/at_http",
      "templateUrl": "components/at_http/at_http.tpl.html"
    },
    "components.at_kitten_model": {
      "camelCased": "atKittenModel",
      "moduleKey": "components.at_kitten_model",
      "modulePath": "components/at_kitten_model/at_kitten_model",
      "templateUrl": "components/at_kitten_model/at_kitten_model.tpl.html"
    },
    "components.at_simple": {
      "camelCased": "atSimple",
      "moduleKey": "components.at_simple",
      "modulePath": "components/at_simple/at_simple",
      "templateUrl": "components/at_simple/at_simple.tpl.html"
    },
    "states.cat": {
      "stateName": "states.cat",
      "directoryUrl": "cat/",
      "camelCased": "statesCat",
      "moduleKey": "states.cat",
      "modulePath": "states/cat/cat",
      "templateUrl": "states/cat/cat.tpl.html"
    },
    "states.cat.kittens": {
      "stateName": "states.cat.kittens",
      "directoryUrl": "kittens/",
      "camelCased": "statesCatKittens",
      "moduleKey": "states.cat.kittens",
      "modulePath": "states/cat/kittens/kittens",
      "templateUrl": "states/cat/kittens/kittens.tpl.html"
    },
    "states.simple": {
      "stateName": "states.simple",
      "directoryUrl": "simple/",
      "camelCased": "statesSimple",
      "moduleKey": "states.simple",
      "modulePath": "states/simple/simple",
      "templateUrl": "states/simple/simple.tpl.html"
    },
    "states": {
      "stateName": "states",
      "directoryUrl": "states/",
      "camelCased": "states",
      "moduleKey": "states",
      "modulePath": "states/states",
      "templateUrl": "states/states.tpl.html"
    }
  },
  "map": {
    "*": {
      "underscore": "lodash"
    }
  }
};
requirejs.config(window._sandboxConfig);