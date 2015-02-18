module.exports = {
  // js:{
  //   options:{
  //     // spawn: true,
  //     livereload:35729
  //   },
  //   files:[
  //     '<%= files.app.spec %>'
  //   ]
  // },
  unit_app:{
    files: '<%= files.app.spec %>',
    tasks: ['karma:unit_app:run']
  },
  // unit_dist:{},
  index:{
    files:'<%= dirs.app %>index_preprocess.html',
    tasks:['htmlbuild:app']
  },
  templates:{
    files:'<%= files.app.templates %>',
    tasks:['html2js']
  },
  config:{
    options:{
      reload:true
    },
    tasks:['requirejs_config_generator'],
    files:['Gruntfile.js','./config/**/*'],
  },
  less:{
    files:'<%= files.app.less %>',
    tasks: ['less']
  },

  // the files to livereload on
  livereload:{
    options:{
      livereload:35729
    },
    files:'<%= files.app.livereload %>'
  }
};
