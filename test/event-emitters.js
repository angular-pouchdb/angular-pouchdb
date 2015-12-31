'use strict';

var self = this;

describe('Angular-wrapped PouchDB event emitters', function() {
  function shouldNotBeCalled(rejection) {
    self.fail(rejection);
  }

  function rawPut(cb) {
    function put($window) {
      var rawDB = new $window.PouchDB('db');
      var doc = {
        _id: 'test'
      };
      rawDB.put(doc, function(err, result) {
        if (err) {
          throw err;
        }
        cb(result);
      });
    }
    inject(put);
  }

  var db;
  beforeEach(function() {
    var $injector = angular.injector(['ng', 'pouchdb']);
    var pouchDB = $injector.get('pouchDB');
    db = pouchDB('db');
  });

  describe('changes', function() {
    it('should resolve on complete', function(done) {
      function success(change) {
        expect(change.results[0].id).toBe('test');
      }

      function changes() {
        db.changes().$promise
          .then(success)
          .catch(shouldNotBeCalled)
          .finally(done);
      }

      rawPut(changes);
    });

    it('should notify on change events', function(done) {
      function notify(event) {
        expect(event.change.id).toBe('test');
      }

      function changes() {
        db.changes().$promise
          .then(null, null, notify)
          .catch(shouldNotBeCalled)
          .finally(done);
      }

      rawPut(changes);
    });
  });

  describe('replicate', function() {
    // TODO: restore in PouchDB >5.1.0
    // See: https://github.com/pouchdb/pouchdb/issues/4595
    xit('should reject on error', function(done) {  // eslint-disable-line
      function error(reason) {
        expect(reason.error).toBe(true);
      }

      db.replicate.to('http:///').$promise
        .catch(error)
        .finally(done);
    });

    it('should notify on paused events', function(done) {
      var opts = {
        live: true
      };

      function notify(event) {
        expect(event.hasOwnProperty('paused')).toBe(true);
        done();
      }

      db.replicate.to('test2', opts).$promise
        .then(null, null, notify)
        .catch(shouldNotBeCalled);
    });

    it('should notify on active events', function(done) {
      var doc = {
        _id: 'active'
      };

      var spies = {
        notify: angular.noop
      };

      spyOn(spies, 'notify');

      function replicate() {
        return db.replicate.to('replicate-active').$promise;
      }

      function hasActiveNotification() {
        function flatten(prev, current) {
          return prev.concat(current);
        }

        function hasActive(args) {
          return args.hasOwnProperty('active');
        }

        var spyArgs = spies.notify.calls.allArgs()
          .reduce(flatten, []);

        expect(spyArgs.some(hasActive)).toBe(true);
        done();
      }

      replicate()
        .then(db.put.bind(db, doc))
        .then(replicate.bind(db))
        .then(null, null, spies.notify)
        .then(hasActiveNotification)
        .catch(shouldNotBeCalled);
    });
  });

  describe('sync', function() {
    it('should resolve on complete', function(done) {
      function success(result) {
        expect(result.push.ok).toBe(true);
      }

      db.sync('test-sync').$promise
        .then(success)
        .catch(shouldNotBeCalled)
        .finally(done);
    });
  });

  afterEach(function(done) {
    function tearDown($window) {
      // Use raw PouchDB (and callback) as a sanity check
      var rawDB = new $window.PouchDB('db');
      rawDB.destroy(function(err, info) {
        if (err) {
          throw err;
        }
        expect(info.ok).toBe(true);
        done();
      });
    }
    inject(tearDown);
  });
});
