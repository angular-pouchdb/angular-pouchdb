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

      function wrapEventEmitters(db) {
        function wrap(fn) {
          return function() {
            var deferred = $q.defer();
            var emitter = fn.apply(this, arguments)
              .on('change', function(change) {
                return deferred.notify(change);
              })
              .on('uptodate', function(uptodate) {
                return deferred.notify(uptodate);
              })
              .on('complete', function(response) {
                return deferred.resolve(response);
              })
              .on('error', function(error) {
                return deferred.reject(error);
              });
            emitter.$promise = deferred.promise;
            return emitter;
          };
        }

        db.changes = wrap(db.changes);
        db.replicate.to = wrap(db.replicate.to);
        db.replicate.from = wrap(db.replicate.from);

        return db;
      }

      return function pouchDB(name, options) {
        var db = new $window.PouchDB(name, options);
        function wrap(method) {
          db[method] = qify(db[method]);
        }
        methods.forEach(wrap);
        return wrapEventEmitters(db);
      };
    };
  });
