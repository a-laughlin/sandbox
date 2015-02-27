angular.module('templates-dashboard', ['app.tpl.html', 'sections/cat/cat.tpl.html', 'sections/cat/kittens/kittens.tpl.html', 'sections/simple/simple.tpl.html']);

angular.module("app.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app.tpl.html",
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

angular.module("sections/cat/cat.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sections/cat/cat.tpl.html",
    "<h3>Cat!</h3>\n" +
    "<ul>\n" +
    "  <li>name:{{appCat.cat.name}}</li>\n" +
    "  <li>sound:{{appCat.cat.sound}}</li>\n" +
    "  <li>color:{{appCat.cat.color}}</li>\n" +
    "</ul>\n" +
    "<div class=\"subsection\" ui-view></div>\n" +
    "");
}]);

angular.module("sections/cat/kittens/kittens.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sections/cat/kittens/kittens.tpl.html",
    "Kittens be here!!\n" +
    "");
}]);

angular.module("sections/simple/simple.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sections/simple/simple.tpl.html",
    "Simple statement: {{appSimple.statement}}\n" +
    "");
}]);
