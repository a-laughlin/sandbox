var _ = require('lodash');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');


var appTree = pickFiles('app', {
  srcDir: '/',
  // files: ['**/*.png', '**/*.jpg'],
  files: [
    'index.html',
    'templates_compiled.js',
    'require-base_compiled.js',
    'app_compiled.css',
    'app.js',
    'sandbox.js',
    'bower/**/*.js',
    'bower/requirejs/require.js'
  ],
  destDir: '/'
});

var tree = mergeTrees(['app']);
// var tree = mergeTrees(['dist']);
module.exports = tree;
