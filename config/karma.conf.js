// // Karma configuration
// // http://karma-runner.github.io/0.10/config/configuration-file.html

// module.exports = function(config) {
//   config.set({
//     // base path, that will be used to resolve files and exclude
//     basePath: '',

//     // testing framework to use (jasmine/mocha/qunit/...)
//     frameworks: ['jasmine'],

//     // list of files / patterns to load in the browser
//     files: [

//       'app/bower_components/jquery/dist/jquery.js',
//       'app/bower_components/jquery-cookie/jquery.cookie.js',
//       'app/bower_components/angular/angular.js',
//       'app/bower_components/angular-mocks/angular-mocks.js',
//       'app/bower_components/angular-resource/angular-resource.js',
//       'app/bower_components/angular-cookies/angular-cookies.js',
//       'app/bower_components/angular-sanitize/angular-sanitize.js',
//       'app/bower_components/angular-route/angular-route.js',
//       'app/bower_components/angular-animate/angular-animate.js',
//       'app/scripts/*.js',
//       'app/scripts/**/*.js',
//       'test/mock/**/*.js',
//       'test/spec/**/*.js',
//       // modules
//       'app/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
//       'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
//       'app/bower_components/fullcalendar/fullcalendar.js',
//       'app/bower_components/angular-ui-calendar/src/calendar.js',
//       'app/bower_components/tinymce/tinymce.min.js',
//       'app/bower_components/angular-ui-tinymce/src/tinymce.js',
//       'app/bower_components/moment/moment.js',
//       'app/bower_components/angular-ui-select2/src/select2.js',
//       'app/bower_components/angular-ui-utils/ui-utils.js',
//       'app/bower_components/angular-money-directive/angular-money-directive.js'
//     ],

//     // list of files / patterns to exclude
//     exclude: [
//       // for some reason this breaks tests returning
//       // jQuery is undefined
//       'app/bower_components/fullcalendar/fullcalendar.js'
//     ],

//     // web server port
//     port: 8080,

//     // level of logging
//     // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
//     logLevel: config.LOG_INFO,


//     // enable / disable watching file and executing tests whenever any file changes
//     autoWatch: true,

//     // preprocessors: {
//     //   '**/app/scripts/**/*.js': ['coverage']
//     // },
//     // add coverage to reporters
//     reporters: ['progress', 'coverage'],
//     // tell karma how you want the coverage results
//     coverageReporter: {
//       type : 'html',
//       // where to store the report
//       dir : 'coverage/'
//     },

//     // Start these browsers, currently available:
//     // - Chrome
//     // - ChromeCanary
//     // - Firefox
//     // - Opera
//     // - Safari (only Mac)
//     // - PhantomJS
//     // - IE (only Windows)
//     browsers: ['Chrome'],


//     // Continuous Integration mode
//     // if true, it capture browsers, run tests and exit
//     singleRun: false
//   });
// };
