module.exports = {
  options: {
    // rulesdir: 'conf/rules'            // custom rules
    // format: require('stylish'), // custom formatter
    format: 'stylish.js', // custom formatter
    config: 'config/eslint.json'        // custom config
  },
  js:[
    '<%= files.app.js_modules %>',
    '<%= files.app.js_module_utils %>'
  ]
};
