module.exports = {
  options: {
    basePath: '',
    frameworks: ['jasmine'],
    port: 8080,
    reporters:'progress',
    // reporters: ['progress', 'coverage'],
    // coverageReporter: {
    //   type : 'html',
    //   // where to store the report
    //   dir : 'coverage/'
    // },
    browsers: ['Chrome'],
    singleRun: false,
    autoWatch:false,
    background:true,
    captureTimeout:10000,
    logLevel:'DEBUG'
  },
  unit_app:{
    options: {
      files: '<%= files.app.test_unit %>'
    }
  },
  // unit_dist:{
  //   options: {
  //     files: '<%= files.app.test_unit %>'
  //   }
  // }
};
