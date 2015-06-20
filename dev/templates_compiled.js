angular.module('templates-app', ['states/cat/cat.tpl.html', 'states/cat/kittens/kittens.tpl.html', 'states/simple/simple.tpl.html', 'states/states.tpl.html']);

angular.module("states/cat/cat.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/cat/cat.tpl.html",
    "<h3>Cat!</h3>\n" +
    "<ul>\n" +
    "  <li>name:{{appCat.cat.name}}</li>\n" +
    "  <li>sound:{{appCat.cat.sound}}</li>\n" +
    "  <li>color:{{appCat.cat.color}}</li>\n" +
    "</ul>\n" +
    "<div class=\"subsection\" ui-view></div>\n" +
    "");
}]);

angular.module("states/cat/kittens/kittens.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/cat/kittens/kittens.tpl.html",
    "Kittens be here!!\n" +
    "");
}]);

angular.module("states/simple/simple.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/simple/simple.tpl.html",
    "Simple statement: {{appSimple.statement}}\n" +
    "");
}]);

angular.module("states/states.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/states.tpl.html",
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <ul class=\"nav nav-pills nav-stacked col-sm-2\">\n" +
    "      <li><a ui-sref=\"app\">Home</a></li>\n" +
    "      <li><a href=\"#\" ui-sref=\"{{state.stateName}}\" ng-repeat=\"state in app.states\">state: {{state.stateName}}</a></li>\n" +
    "    </ul>\n" +
    "    <div class=\"col-sm-10\" ui-view></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
