'use strict';

var self = this;

describe('Angular-wrapped PouchDB event emitters', function() {
  function shouldNotBeCalled(rejection) {
    self.fail(rejection);
  }

  var db;
  beforeEach(function() {
    var $injector = angular.injector(['ng', 'pouchdb']);
    var pouchDB = $injector.get('pouchDB');
    db = pouchDB('db');
  });

  it('should wrap changes', function(done) {
    function changes() {
      return db.changes().$promise;
    }

    function success(change) {
      expect(change.results[0].id).toBe('test');
    }

    db.put({_id: 'test'})
      .then(changes)
      .then(success)
      .catch(shouldNotBeCalled)
      .finally(done);
  });

  afterEach(function(done) {
    function tearDown($window) {
      // Use raw PouchDB (and callback) as a sanity check
      $window.PouchDB.destroy('db', function(err, info) {
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
