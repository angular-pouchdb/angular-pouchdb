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
    it('should reject on error', function(done) {
      function error(reason) {
        expect(reason.error).toBe(true);
      }

      db.replicate.to('http:///').$promise
        .catch(error)
        .finally(done);
    });

    it('should notify on uptodate events', function(done) {
      var opts = {
        live: true
      };

      function notify(event) {
        expect(event.uptodate.ok).toBe(true);
        done();
      }

      db.replicate.to('test2', opts).$promise
        .then(null, null, notify)
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
