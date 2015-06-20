;(function(win,rjs){
  win._sandboxConfig={
  "baseUrl": "./",
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
    "angular-modelizer": "bower/angular-modelizer/dist/angular-modelizer",
    "states.cat": "cat/cat",
    "states.cat.kittens": "cat/kittens/kittens",
    "states.simple": "simple/simple",
    "states": "states",
    "components.at_cat_model": "components/at_cat_model/at_cat_model",
    "components.at_collection": "components/at_collection/at_collection",
    "components.at_directive-factory": "components/at_directive-factory/at_directive-factory",
    "components.at_http": "components/at_http/at_http",
    "components.at_kitten_model": "components/at_kitten_model/at_kitten_model",
    "components.at_simple": "components/at_simple/at_simple",
    "components.at_stores": "components/at_stores/at_stores"
  },
  "map": {
    "*": {
      "underscore": "lodash"
    }
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
    "angular-modelizer": {
      "deps": [
        "angular"
      ]
    },
    "app": {
      "deps": [
        "sandbox",
        "angular-mocks",
        "compiled-templates",
        "angular",
        "postal",
        "angular-modelizer",
        "angular-ui-router"
      ]
    }
  },
  "onAsyncMap": {},
  "normedModules": {
    "states.cat": {
      "directoryUrl": "cat",
      "moduleKey": "states.cat",
      "stateName": "states.cat",
      "camelCased": "statesCat",
      "modulePath": "cat/cat",
      "templateUrl": "cat/cat.tpl.html"
    },
    "states.cat.kittens": {
      "directoryUrl": "cat/kittens",
      "moduleKey": "states.cat.kittens",
      "stateName": "states.cat.kittens",
      "camelCased": "statesCatKittens",
      "modulePath": "cat/kittens/kittens",
      "templateUrl": "cat/kittens/kittens.tpl.html"
    },
    "states.simple": {
      "directoryUrl": "simple",
      "moduleKey": "states.simple",
      "stateName": "states.simple",
      "camelCased": "statesSimple",
      "modulePath": "simple/simple",
      "templateUrl": "simple/simple.tpl.html"
    },
    "states": {
      "directoryUrl": "/",
      "moduleKey": "states",
      "stateName": "states",
      "camelCased": "states",
      "modulePath": "states",
      "templateUrl": "states.tpl.html"
    },
    "components.at_cat_model": {
      "directoryUrl": "components/at_cat_model",
      "moduleKey": "components.at_cat_model",
      "camelCased": "componentsAtCatModel",
      "modulePath": "components/at_cat_model/at_cat_model",
      "templateUrl": "components/at_cat_model/at_cat_model.tpl.html"
    },
    "components.at_collection": {
      "directoryUrl": "components/at_collection",
      "moduleKey": "components.at_collection",
      "camelCased": "componentsAtCollection",
      "modulePath": "components/at_collection/at_collection",
      "templateUrl": "components/at_collection/at_collection.tpl.html"
    },
    "components.at_directive-factory": {
      "directoryUrl": "components/at_directive-factory",
      "moduleKey": "components.at_directive-factory",
      "camelCased": "componentsAtDirectiveFactory",
      "modulePath": "components/at_directive-factory/at_directive-factory",
      "templateUrl": "components/at_directive-factory/at_directive-factory.tpl.html"
    },
    "components.at_http": {
      "directoryUrl": "components/at_http",
      "moduleKey": "components.at_http",
      "camelCased": "componentsAtHttp",
      "modulePath": "components/at_http/at_http",
      "templateUrl": "components/at_http/at_http.tpl.html"
    },
    "components.at_kitten_model": {
      "directoryUrl": "components/at_kitten_model",
      "moduleKey": "components.at_kitten_model",
      "camelCased": "componentsAtKittenModel",
      "modulePath": "components/at_kitten_model/at_kitten_model",
      "templateUrl": "components/at_kitten_model/at_kitten_model.tpl.html"
    },
    "components.at_simple": {
      "directoryUrl": "components/at_simple",
      "moduleKey": "components.at_simple",
      "camelCased": "componentsAtSimple",
      "modulePath": "components/at_simple/at_simple",
      "templateUrl": "components/at_simple/at_simple.tpl.html"
    },
    "components.at_stores": {
      "directoryUrl": "components/at_stores",
      "moduleKey": "components.at_stores",
      "camelCased": "componentsAtStores",
      "modulePath": "components/at_stores/at_stores",
      "templateUrl": "components/at_stores/at_stores.tpl.html"
    }
  }
};
  rjs.config(win._sandboxConfig);
})(window,requirejs);