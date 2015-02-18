var _ = require('underscore');
var base = require('./protractor-base.conf');

exports.config = _.extend({}, base.config, {
  seleniumAddress: 'http://windows-server.attend.com:4444/wd/hub',
  baseUrl: 'http://husky-dashboard.attendware.com',
  params: {
    mode: 'jenkins'
  }
});
