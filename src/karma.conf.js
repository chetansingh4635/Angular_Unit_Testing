// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  const puppeteer = require('puppeteer');
  process.env.CHROME_BIN = puppeteer.executablePath();
  config.set({
    basePath: '',
    browsers: ['IE'],
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-ie-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-junit-reporter')
    ],
    client: {
      clearContext: true // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly','text-summary', 'cobertura'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'junit','mocha'],
    //reporters: ['progress','mocha'],
    junitReporter: {
      outputDir: '../junit'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    //autoWatch: true,
    autoWatch: false,
    browserNoActivityTimeout:30000,
    //running for build
    browsers: ['ChromeHeadless'], 
     //running in browsers on developer machine for example 
    //browsers: ['Chrome','Firefox','IE'],
     //browsers: ['Chrome'],   
    //browsers: ['Firefox'],
    //browsers: ['IE'],
    //browsers: ['IE_no_addons'],
    //browsers: ['IE10'],
    
    customLaunchers: {
      IE_no_addons: {
        base:  'IE',
        flags: ['-extoff']
      },
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10',        
      },
      IE8: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE8',
        flags: ['-extoff']
      }
    },
    //singleRun: false //keeps browsers open, with this set to false you can use the autowatch flag = true so that when make changes reruns tests automatically
    singleRun : true //this will close the browser after one full set of run tests or complete the tests after running once
  });

};
