(function(window, angular, undefined) {
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
    'sync',
    'putAttachment',
    'getAttachment',
    'removeAttachment',
    'query',
    'viewCleanup',
    'info',
    'compact',
    'revsDiff'
  ])
  .provider('pouchDB', ["POUCHDB_DEFAULT_METHODS", function(POUCHDB_DEFAULT_METHODS) {
    this.methods = POUCHDB_DEFAULT_METHODS;
    this.$get = ["$q", "$window", "$rootScope", function($q, $window, $rootScope) {
      var methods = this.methods;
      function qify(fn) {
        return function() {
          var deferred = $q.defer();
          function callback(err, res) {
            return $rootScope.$apply(function() {
              if (err) {
                return deferred.reject(err);
              }
              return deferred.resolve(res);
            });
          }
          var args = [];
          if (arguments !== null) {
            args = Array.prototype.slice.call(arguments);
          }
          args.push(callback);
          fn.apply(this, args);
          return deferred.promise;
        };
      }

      return function pouchDB(name, options) {
        var db = new $window.PouchDB(name, options);

        var api = {};
        methods.forEach(function(method) {
          api[method] = qify(db[method].bind(db));
        });

        api.changes = function(options) {
          var clone = angular.copy(options);
          clone.onChange = function(change) {
            return $rootScope.$apply(function() {
              return options.onChange(change);
            });
          };
          return db.changes(clone);
        };

        api.replicate = {
          to: db.replicate.to.bind(db),
          from: db.replicate.from.bind(db)
        };

        return api;
      };
    }];
  }]);
})(window, window.angular);
