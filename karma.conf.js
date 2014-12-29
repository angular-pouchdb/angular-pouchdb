'use strict';
/*eslint-env node */

var bowerJS = require('wiredep')({
  devDependencies: true
}).js;

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: bowerJS.concat([
      'angular-pouchdb.js',
      'test/*.js'
    ]),
    browsers: ['PhantomJS'],
    autoWatch: false,
    singleRun: true
  });
};
