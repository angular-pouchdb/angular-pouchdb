'use strict';

angular.module('pouchdb', [])
  .factory('pouchDB', function($q, $rootScope, $window) {
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

    var methods = [
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
    ];

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
  });
