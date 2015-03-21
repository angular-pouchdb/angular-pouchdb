'use strict';

angular.module('pouchdb', [])
  .constant('POUCHDB_METHODS', {
    destroy: 'qify',
    put: 'qify',
    post: 'qify',
    get: 'qify',
    remove: 'qify',
    bulkDocs: 'qify',
    allDocs: 'qify',
    putAttachment: 'qify',
    getAttachment: 'qify',
    removeAttachment: 'qify',
    query: 'qify',
    viewCleanup: 'qify',
    info: 'qify',
    compact: 'qify',
    revsDiff: 'qify',
    changes: 'eventEmitter',
    sync: 'eventEmitter',
    replicate: {
      to: 'eventEmitter',
      from: 'eventEmitter'
    }
  })
  .service('pouchDecorators', function($q) {
    this.qify = function(fn) {
      return function() {
        return $q.when(fn.apply(this, arguments));
      };
    };

    this.eventEmitter = function(fn) {
      return function() {
        var deferred = $q.defer();
        var emitter = fn.apply(this, arguments)
          .on('change', function(change) {
            return deferred.notify({
              change: change
            });
          })
          .on('uptodate', function(uptodate) {
            return deferred.notify({
              uptodate: uptodate
            });
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
    };
  })
  .provider('pouchDB', function(POUCHDB_METHODS) {
    var self = this;
    self.methods = POUCHDB_METHODS;
    self.$get = function($window, pouchDecorators) {
      function wrapMethods(db, methods, parent) {
        for (var method in methods) {
          var wrapFunction = methods[method];

          if (!angular.isString(wrapFunction)) {
            return wrapMethods(db, wrapFunction, method);
          }

          wrapFunction = pouchDecorators[wrapFunction];

          if (!parent) {
            db[method] = wrapFunction(db[method]);
            continue;
          }

          db[parent][method] = wrapFunction(db[parent][method]);
        }
        return db;
      }

      return function pouchDB(name, options) {
        var db = new $window.PouchDB(name, options);
        return wrapMethods(db, self.methods);
      };
    };
  });
