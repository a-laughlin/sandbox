module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  // different config files
  // single loader file template that gets compiled into dist folders

  var configObj = {
    pkg: grunt.file.readJSON('package.json'),
    // env: process.env,
    dirs:{
      root:'',
      app:'<%= dirs.root %>app/',
      bower:'<%= dirs.app %>bower/',
      vendor:'<%= dirs.app %>vendor/',
      states:'<%= dirs.app %>states/',
      components:'<%= dirs.app %>components/',
      vendor_bower:'<%= dirs.app %>{bower,vendor}/',
      app_states_components:'<%= dirs.app %>{,states/**/,components/**/}',
      // app_states_components:'<%= dirs.app %>{app_module}.js',
      dist:{
        root:'<%= dirs.root %>dist/',
        app:'<%= dirs.dist.root %>app/'
      },
    },
    files:{
      app:{
        // ours
        less: '<%= dirs.app_states_components %>*.less',
        compiled_css:'<%= dirs.app %>app_compiled.css',

        // vendor
        vendor_less:[
          // '<%= dirs.bower %>angular-wizard/dist/angular-wizard.less'
        ],
        vendor_css:[
          '<%= dirs.bower %>components-font-awesome/css/font-awesome.css',
          '<%= dirs.bower %>bootstrap/dist/css/bootstrap.css',
          '<%= dirs.bower %>angular-growl-v2/build/angular-growl.css'
        ],
        compiled_vendor_css:'<%= dirs.app %>vendor_compiled.css',


        // html and templates
        templates:'<%= dirs.app_states_components %>*tpl.html',
        compiled_templates:'<%= dirs.app %>templates_compiled.js',
        vendor_templates:[],

        // javascript
        js_events_modules:'<%= dirs.states %>',
        js_modules: [
          '<%= dirs.app_states_components %>*.js',
          '!<%= dirs.app_states_components %>*{spec,utils}.js',
          '!<%= files.app.js_module_utils %>'
        ],
        js_module_utils: '<%= dirs.app_states_components %>*_utils.js',
        js_head_scripts:'<%= dirs.app %>head_scripts.js',
        compiled_js:'app_compiled.js',
        compiled_vendor_js:'<%= dirs.app %>vendor_compiled.js',
        require_base_compiled:'<%= dirs.app %>require-base_compiled.js',
        vendor_js:[
          '<%= dirs.vendor %>angular-schema-form/schema-form.js',
          '<%= dirs.vendor %>angular-schema-form/boostrap-decorator.js'
        ],

        // all compiled elements (for clean);

        // DO NOT CHANGE. THESE GET DELETED AND RECREATED FREQUENTLY
        compiled_src:[
          '<%= dirs.app %>index.html',
          '<%= files.app.compiled_templates %>',
          '<%= files.app.require_base_compiled %>',
          '<%= files.app.compiled_css %>',
          '<%= files.app.compiled_vendor_css %>',
          '<%= files.app.compiled_vendor_js %>'
        ],
        livereload:[
          '<%= files.app.compiled_src %>',
          '<%= files.app.vendor_js %>',
          '<%= files.app.js_modules %>',
          '<%= files.app.js_module_utils %>',
        ],

        spec:'<%= dirs.app_states_components %>*spec.js',

        test_unit:[
          '<%= files.app.vendor_js %>',
          '<%= dirs.bower %>angular-mocks/angular-mocks.js',
          '<%= files.app.js_modules %>',
          '<%= files.app.compiled_templates %>',
          '<%= files.app.js_module_utils %>',
          '<%= files.app.spec %>'
        ]
      },
      dist:{
        compiled_src:'<%= files.app.compiled_src %>'
      }
    }
  };

  // only lint the files that changed...
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('eslint.js', filepath);
  });
  // disabling this because it's still slow.
  // created a separate lint task
  // extend our config object with other files
  //       tasks: ['eslint','karma:dev:run'] },
  //   }
  // });

  // grunt.registerTask('build', ['eslint', 'uglify']);
  // grunt.registerTask('test', ['karma:dev']);
  // grunt.registerTask('test:all', ['build', 'karma']);
  // grunt.registerTask('default', ['test','watch']);
  grunt.registerTask('default', [
    'app',
    // 'karma:unit_app',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('nowatch', [
    'app',
    // 'karma:unit_app',
    'connect:nowatch',
  ]);

  grunt.registerTask('app', [
    'clean:app',
    // dev runs on all the various states by not specifying any in the grunt config
    'requirejs_config_generator:app',
    'concurrent:app',
    'htmlbuild:app'
  ]);

  grunt.registerTask('dist', [
    'app'
  ]);



  grunt.registerTask('lint', [
    'eslint:js'
  ]);

  grunt.registerTask('test', [
    'karma:standalone'
  ]);




  // load all our configs and init grunt
  var path = require('path');
  var newConfig = require('load-grunt-config')(grunt,{
    configPath:path.join(process.cwd(), 'config' , 'grunt'),
    init:true,
    data:configObj,
    loadGruntTasks:false
  });

  var _ = require('lodash');
  var fs = require('fs');
  grunt.registerMultiTask('requirejs_config_generator', 'concatenating into final requirejs config file', function(states) {
    var opts = this.options({
      baseFile:''
    });

    var outputObj = _.merge({
      baseUrl: './',
      deps: [],
      paths: {},
      shim: {},
      responseMap:{},
      normedModules:{}
    },require(opts.baseFile));
    var nm = outputObj.normedModules;
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      f.src.filter(function(filepath) {
        if (grunt.file.exists(filepath)) {return true;};
        // Warn on and remove invalid source files (if nonull was set).
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      })
      .forEach(function(path) {
        // auto-create the keys for base states and component modules
        var key;
        var norm;
        if(path.indexOf('app/states')===0){
          key = path.replace(/^app\/(.*?)\/[^\/]+.js$/,'$1').replace(/\//g,'.');
          norm = {};
          norm.stateName = key; // plans.manage
          norm.directoryUrl = path.replace(/^.+\/([^\/]+)\.js$/,'$1/'); // /plans/manage/
          norm.camelCased = _.camelCase(key); // states/plans/manage/manage_module
        }
        else if(path.indexOf('app/components')===0){
          key = path.replace(/^app\/(.*?)\/[^\/]+.js$/,'$1').replace(/\//g,'.');
          norm = {};
          norm.camelCased = _.camelCase(key.replace(/^components\./,'')); // states/plans/manage/manage_module
        }
        if(key){
          outputObj.paths[key] = path;
          var matches = grunt.file.read(path).match(/response ?\( ?["'][a-zA-Z0-9]+/g) || [];
          matches.forEach(function (val,i) {
            outputObj.responseMap[val.replace(/^response ?\( ?["']/,'')] = key;
          });
          norm.moduleKey = key; // plans.manage
          nm[norm.moduleKey] = norm;
        }
      });
      _.forOwn(outputObj.paths,function(path,key){
        outputObj.paths[key] = grunt.config.process(path).replace(/^app\/(.+?)(\.js)?$/,'$1');
        var norm = nm[key];
        if(norm){
          norm.modulePath = outputObj.paths[key]; // states/plans/manage/manage_module
          norm.templateUrl = norm.modulePath + '.tpl.html';
          // grunt.log.writeln(key,':',outputObj.paths[key]);
        }
      });
      // Write the destination file.
      grunt.file.write(f.dest, 'window._sandboxConfig=' + JSON.stringify(outputObj,null,'  ') + ';\nrequirejs.config(window._sandboxConfig);');

      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};
