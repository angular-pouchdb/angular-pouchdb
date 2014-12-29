'use strict';

var self = this;

describe('angular-pouchdb', function() {
  var db;

  function shouldBeOK(response) {
    expect(response.ok).toBe(true);
  }

  function shouldNotBeCalled(rejection) {
    self.fail(rejection);
  }

  function shouldBeMissing(response) {
    expect(response.status).toBe(404);
  }

  beforeEach(function() {
    // https://github.com/ocombe/angular-localForage/issues/27#issuecomment-54844116
    // because(?) https://github.com/angular/angular.js/issues/2881#issuecomment-39017671
    var $injector = angular.injector(['ng', 'pouchdb']);
    var pouchDB = $injector.get('pouchDB');
    db = pouchDB('db');
  });

  describe('PouchDB public API', function() {
    it('should monkey patch PouchDB#destroy', function(done) {
      db.destroy()
        .then(shouldBeOK)
        .catch(shouldNotBeCalled)
        .finally(done);
    });

    it('should monkey patch PouchDB#put', function(done) {
      db.put({_id: '1'})
        .then(shouldBeOK)
        .catch(shouldNotBeCalled)
        .finally(done);
    });

    it('should monkey patch PouchDB#post', function(done) {
      db.post({})
        .then(shouldBeOK)
        .catch(shouldNotBeCalled)
        .finally(done);
    });

    it('should monkey patch PouchDB#get', function(done) {
      db.get('')
        .then(shouldNotBeCalled)
        .catch(shouldBeMissing)
        .finally(done);
    });

    it('should monkey patch PouchDB#remove', function(done) {
      db.remove('')
        .then(shouldNotBeCalled)
        .catch(shouldBeMissing)
        .finally(done);
    });

    it('should monkey patch PouchDB#info', function(done) {
      function success(response) {
        expect(response.db_name).toBe('db');
      }
      db.info()
        .then(success)
        .catch(shouldNotBeCalled)
        .finally(done);
    });
  });

  it('should pass through rejections', function(done) {
    function errorHandler(rejection) {
      expect(rejection).toBeDefined();
    }
    db.put()
      .then(shouldNotBeCalled)
      .catch(errorHandler)
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
