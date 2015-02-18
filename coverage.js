var fs = require('fs');
var path = require('path'); 

var COVERAGE_PATH = path.join(__dirname, 'coverage');
var INDEX_PATH = path.join(COVERAGE_PATH, 'index.html');

fs.readdir(COVERAGE_PATH, function (error, dirs) {
  if (error) {
    console.error('Failed to generate report');

    throw error;
    process.exit(1);
  }

  dirs = dirs.filter(function (d) { return d !== 'index.html' });

  var html = generateIndexPage(dirs);

  fs.writeFile(INDEX_PATH, html, function (error) {
    if (error) {
      console.error('Failed to write', INDEX_PATH);
      process.exit(1);
    }

    console.log('Create report index page at ', INDEX_PATH);
  });
});

function generateIndexPage(dirs) {
  var page = '<ul>';
  var i;

  for (i = 0; i < dirs.length; i++) {
    var dir = dirs[i];
    var encodedDir = encodeURIComponent(dir);

    page += '<li><a href="' + path.join(encodedDir, 'index.html') + '">' + dir + '</a></li>';
  }

  return page + '</ul>';
}
