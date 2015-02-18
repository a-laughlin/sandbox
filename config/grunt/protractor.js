module.exports = {
  dev: {
    configFile: 'protractor-dev.conf.js'
  },
  'jenkins-ie': {
    options: {
      configFile: 'protractor-jenkins.conf.js',
      args: {
        browser: 'ie'
      }
    }
  },
  'jenkins-safari': {
    options: {
      configFile: 'protractor-jenkins.conf.js',
      args: {
        browser: 'safari'
      }
    }
  },
  'jenkins-firefox': {
    options: {
      configFile: 'protractor-jenkins.conf.js',
      args: {
        browser: 'firefox'
      }
    }
  },
  'jenkins-chrome': {
    options: {
      configFile: 'protractor-jenkins.conf.js',
      args: {
        browser: 'chrome'
      }
    }
  }
};
