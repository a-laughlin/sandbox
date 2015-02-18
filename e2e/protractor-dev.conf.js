var _ = require('underscore');
var base = require('./protractor-base.conf');

exports.config = _.extend({}, base.config, {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
  baseUrl: 'http://127.0.0.1:9002',
  capabilities: { 'browserName': 'chrome' },
  params: {
    mode: 'dev'
  }
});
