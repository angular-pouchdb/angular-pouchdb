'use strict';

/*eslint-env node */

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/tlvince-blob-shim/Blob.js',
      'bower_components/pouchdb/dist/pouchdb.js',
      'angular-pouchdb.js',
      'test/*.js'
    ],
    browsers: [
      'PhantomJS',
      'Firefox'
    ],
    autoWatch: false,
    singleRun: true,
    reporters: [
      'progress',
      'coverage'
    ],
    preprocessors: {
      'angular-pouchdb.js': ['coverage']
    },
    coverageReporter: {
      dir: 'test/coverage',
      reporters: [
        {
          type: 'lcov',
          subdir: 'lcov'
        }
      ]
    }
  });
};
