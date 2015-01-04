'use strict';

var self = this;

describe('angular-pouchdb instance', function() {
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

    it('should monkey patch PouchDB#bulkDocs', function(done) {
      var docs = [{}, {}];
      function success(response) {
        expect(response.length).toBe(2);
        response.forEach(shouldBeOK);
      }
      db.bulkDocs(docs)
        .then(success)
        .catch(shouldNotBeCalled)
        .finally(done);
    });

    it('should monkey patch PouchDB#allDocs', function(done) {
      function success(response) {
        expect(response.total_rows).toBe(1);
        expect(response.rows[0].key).toBe('test');
      }

      function allDocs() {
        db.allDocs()
          .then(success)
          .catch(shouldNotBeCalled)
          .finally(done);
      }

      function rawPut($window) {
        var rawDB = new $window.PouchDB('db');
        var doc = {_id: 'test'};
        rawDB.put(doc, function(err) {
          if (err) {
            throw err;
          }
          allDocs();
        });
      }

      inject(rawPut);
    });

    it('should monkey patch PouchDB#viewCleanup', function(done) {
      db.viewCleanup()
        .then(shouldBeOK)
        .catch(shouldNotBeCalled)
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

    it('should monkey patch PouchDB#compact', function(done) {
      db.compact()
        .then(shouldBeOK)
        .catch(shouldNotBeCalled)
        .finally(done);
    });

    it('should monkey patch PouchDB#revsDiff', function(done) {
      var diff = {test: ['1']};
      function success(response) {
        expect(response.test.missing[0]).toBe('1');
      }
      db.revsDiff(diff)
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
