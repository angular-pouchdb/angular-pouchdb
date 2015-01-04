'use strict';

angular.module('pouchdb', [])
  .constant('POUCHDB_DEFAULT_METHODS', [
    'destroy',
    'put',
    'post',
    'get',
    'remove',
    'bulkDocs',
    'allDocs',
    'putAttachment',
    'getAttachment',
    'removeAttachment',
    'query',
    'viewCleanup',
    'info',
    'compact',
    'revsDiff'
  ])
  .provider('pouchDB', function(POUCHDB_DEFAULT_METHODS) {
    this.methods = POUCHDB_DEFAULT_METHODS;
    this.$get = function($q, $window) {
      var methods = this.methods;

      function qify(fn) {
        return function() {
          return $q.when(fn.apply(this, arguments));
        };
      }

      return function pouchDB(name, options) {
        var db = new $window.PouchDB(name, options);
        function wrap(method) {
          db[method] = qify(db[method]);
        }
        methods.forEach(wrap);
        return db;
      };
    };
  });
