var _ = require('lodash');
var bLiveReload = require('broccoli-inject-livereload');
var bFunnel = require('broccoli-funnel');
var bConcat = require('broccoli-concat');
var bMergeTrees = require('broccoli-merge-trees');
var bNgAnnotate = require('broccoli-ng-annotate');
var bLessSingle = require('broccoli-less-single');
var bStew = require('broccoli-stew');
var bTemplater = require('broccoli-templater');
var log = bStew.log;

var trees = {};
trees.project = bFunnel('.',{srcDir:  '/', destDir: '/'});
trees.app = bFunnel(trees.project,{srcDir:  './app', destDir: '/dev'});
trees.appComponentsStates = bFunnel(trees.app,{include:[function(arg1,arg2,arg3,arg4){
  console.log('arg1,arg2,arg3,arg4',arg1,arg2,arg3,arg4);
  return './{components,states}';
}]});
// trees.bower = bFunnel(trees.app,{include:[function(arg1,arg2,arg3,arg4){
//   console.log('arg1,arg2,arg3,arg4',arg1,arg2,arg3,arg4);
//   return './bower';
// }]});
// trees.js = bFunnel(trees.app,{include:[function(arg1,arg2,arg3,arg4){
//   console.log('arg1,arg2,arg3,arg4',arg1,arg2,arg3,arg4);
//   return /\.js$/;
// }]});
// trees.less = bFunnel(trees.app,{include:[function(arg1,arg2,arg3,arg4){
//   console.log('arg1,arg2,arg3,arg4',arg1,arg2,arg3,arg4);
//   return /\.less$/;
// }]});
// trees.tpl = bFunnel(trees.app,{include:[function(arg1,arg2,arg3,arg4){
//   console.log('arg1,arg2,arg3,arg4',arg1,arg2,arg3,arg4);
//   return /\.tpl\.html$/;
// }]});
// trees.less = bLessSingle(trees.app, 'style.less', 'style.css', {paths: ['./{components,states}/**/*.less'] });

trees.index = new bTemplater(trees.app, './index_preprocess.html', function buildVariables(content, relativePath) {
  console.log('relativePath',relativePath);
  console.log('content',content);
  return {
    moduleBody: content,
    foo:'bar'
  };
});

if(process.env.NODE_ENV==='development'){

} else if (process.env.NODE_ENV==='production'){

}
// var appTree = pickFiles(trees.app, {
//   srcDir: '/',
//   // files: ['**/*.png', '**/*.jpg'],
//   files: [
//     'index.html',
//     'templates_compiled.js',
//     'require-base_compiled.js',
//     'app_compiled.css',
//     'app.js',
//     'sandbox.js',
//     'bower/**/*.js',
//     'bower/requirejs/require.js'
//   ],
//   destDir: '/'
// });

var tree = mergeTrees([trees.appComponentsStates]);
// var tree = mergeTrees(['dist']);
module.exports = tree;

