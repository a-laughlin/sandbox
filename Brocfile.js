var _ = require('lodash');
var bLiveReload = require('broccoli-inject-livereload');
var livereload = require('livereload');
var fs = require('fs');
var bFunnel = require('broccoli-funnel');
var bConcat = require('broccoli-concat');
var bMergeTrees = require('broccoli-merge-trees');
var bNgAnnotate = require('broccoli-ng-annotate');
var bLessSingle = require('broccoli-less-single');
var bStew = require('broccoli-stew');
var bStringReplace = require('broccoli-string-replace');
var logTree = function(treeName,options){
  var opts = _.defaults(options||{},{
    output: 'tree',
    label:treeName
  });
  return bStew.log(trees[treeName], opts);
};




function normModule(dirPath,relativePath){
  if(relativePath.indexOf('.js') < 0)return true;
  var norm = {};
  norm.directoryUrl = relativePath.replace(/(.*?)\/?[a-zA-Z0-9_-]+\.js$/,'$1');
  if(dirPath.indexOf('states') > -1){ // working with a state
    norm.moduleKey = norm.directoryUrl.replace(/\//g,'.').replace(/\.$/,'');
    norm.stateName = norm.moduleKey = norm.moduleKey ? 'states.'+ norm.moduleKey : 'states';
    outputObj.paths[norm.moduleKey] = relativePath.replace(/\.js$/,'');
  } else if(dirPath.indexOf('components') > -1) {
    norm.directoryUrl = 'components/'+norm.directoryUrl;
    norm.moduleKey = norm.directoryUrl.replace(/\//g,'.');
    outputObj.paths[norm.moduleKey] = 'components/'+relativePath.replace(/\.js$/,'');
  }
  norm.camelCased = _.camelCase(norm.moduleKey);
  norm.modulePath = outputObj.paths[norm.moduleKey];
  norm.templateUrl = norm.modulePath + '.tpl.html';
  outputObj.normedModules[norm.moduleKey] = norm;
  // console.log('dirPath+relativePath',dirPath+relativePath);
  var content = fs.readFileSync(dirPath+relativePath,'utf-8');
  var matches = content.match(/response ?\( ?["'][a-zA-Z0-9]+/g) || [];
  matches.forEach(function (val,i) {
    outputObj.responseMap[val.replace(/^response ?\( ?["']/,'')] = norm.moduleKey;
  });
  return true;
}

var outputObj = {
  baseUrl: './',
  deps: [],
  paths: {},
  shim: {},
  responseMap:{},
  normedModules:{}
};




var trees = {};
trees.app = bFunnel('app',{srcDir:  './', destDir: './',include:[/\.(js|css|less|html)$/],exclude:[/tmp/,/\/\..*/,/spec\.js$/]});
trees.components = bFunnel(trees.app,{
  srcDir:'./components',
  destDir: './components',
  include:[function(relativePath){
    return normModule(__dirname+'/app/components/',relativePath);
  }]
});
trees.states = bFunnel(trees.app,{
  srcDir:'./states',
  destDir:'./',
  include:[function (relativePath) {
    return normModule(__dirname+'/app/states/',relativePath);
  }]
});
trees.appFiles = bFunnel(trees.app,{include:['*.{js,css,less,html}'],exclude:['index.html','require-base.js']});
trees.bower = bFunnel(trees.app,{include:[/bower\/.*/]});
trees.requireBase = bFunnel(trees.app,{include:['require-base.js']});
trees.requireBaseCompiled = bStew.map(trees.requireBase,function (content, relativePath) {

  return  ';(function(win,rjs){\n'+
          '  win._sandboxConfig=' +JSON.stringify(_.merge(JSON.parse(content),outputObj),null,'  ') + ';\n'+
          '  rjs.config(win._sandboxConfig);\n'+
          '})(window,requirejs);';
});
trees.index = bFunnel(trees.app,{include:['index.html']});
trees.indexCompiled = bStew.map(trees.index,'index.html',function (content,relativePath) {
  // var indexTemplateFn = _.template(content);
  // parse index and insert variables here
  return content;
});
trees.indexLiveReload = bLiveReload(trees.indexCompiled);
trees.less = bLessSingle([trees.states,trees.components,trees.appFiles], 'temp.less', 'app.css', {paths: ['*.less'] });
trees.output = bMergeTrees([
  trees.appFiles,
  trees.less,
  trees.states,
  trees.components,
  trees.bower,
  trees.indexLiveReload,
  trees.requireBaseCompiled
]);

module.exports = trees.output;

bStew.beforeBuild(trees.output,function () {
  // livereload tmp -i 500
  // require('child-process').exec
  // livereload = require('livereload');
  // server = livereload.createServer();
  // server.watch(__dirname + "/tmp");
});
bStew.afterBuild(trees.output,function () {
  console.log('AFTER BUILD');
});

console.log('process.env.NODE_ENV',process.env.NODE_ENV);
if(process.env.NODE_ENV==='development'){

} else if (process.env.NODE_ENV==='production'){

}

