'use strict';

var self = this;

describe('Angular-aware PouchDB public API', function() {
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

  beforeEach(function() {
    var $injector = angular.injector(['ng', 'pouchdb']);
    var pouchDB = $injector.get('pouchDB');
    db = pouchDB('db');
  });

  it('should wrap destroy', function(done) {
    db.destroy()
      .then(shouldBeOK)
      .catch(shouldNotBeCalled)
      .finally(done);
  });

  it('should wrap put', function(done) {
    var doc = {
      _id: '1'
    };
    db.put(doc)
      .then(shouldBeOK)
      .catch(shouldNotBeCalled)
      .finally(done);
  });

  it('should wrap post', function(done) {
    db.post({})
      .then(shouldBeOK)
      .catch(shouldNotBeCalled)
      .finally(done);
  });

  it('should wrap get', function(done) {
    db.get('')
      .then(shouldNotBeCalled)
      .catch(shouldBeMissing)
      .finally(done);
  });

  it('should wrap remove', function(done) {
    db.remove('')
      .then(shouldNotBeCalled)
      .catch(shouldBeMissing)
      .finally(done);
  });

  it('should wrap bulkDocs', function(done) {
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

  it('should wrap allDocs', function(done) {
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

    rawPut(allDocs);
  });

  it('should wrap putAttachment', function(done) {
    function putAttachment(putDocResult) {
      var id = putDocResult.id;
      var rev = putDocResult.rev;
      var attachment = new Blob(['test'], {
        type: 'text/plain'
      });

      db.putAttachment(id, 'test', rev, attachment, 'text/plain')
        .then(shouldBeOK)
        .catch(shouldNotBeCalled)
        .finally(done);
    }

    rawPut(putAttachment);
  });

  it('should wrap getAttachment', function(done) {
    function getAttachment() {
      return db.getAttachment('test', 'test');
    }

    function success(response) {
      expect(response.type).toBe('text/plain');
    }

    function putAttachment(putDocResult) {
      var id = putDocResult.id;
      var rev = putDocResult.rev;
      var attachment = new Blob(['test'], {
        type: 'text/plain'
      });

      db.putAttachment(id, 'test', rev, attachment, 'text/plain')
        .then(getAttachment)
        .then(success)
        .catch(shouldNotBeCalled)
        .finally(done);
    }

    rawPut(putAttachment);
  });

  it('should wrap removeAttachment', function(done) {
    function removeAttachment(response) {
      return db.removeAttachment('test', 'test', response.rev);
    }

    function putAttachment(putDocResult) {
      var id = putDocResult.id;
      var rev = putDocResult.rev;
      var attachment = new Blob(['test']);

      db.putAttachment(id, 'test', rev, attachment, 'text/plain')
        .then(removeAttachment)
        .then(shouldBeOK)
        .catch(shouldNotBeCalled)
        .finally(done);
    }

    rawPut(putAttachment);
  });

  it('should wrap query', function(done) {
    function map() {
      return;
    }

    function success(response) {
      expect(response.total_rows).toBe(0);
    }

    db.query(map)
      .then(success)
      .catch(shouldNotBeCalled)
      .finally(done);
  });

  it('should wrap viewCleanup', function(done) {
    db.viewCleanup()
      .then(shouldBeOK)
      .catch(shouldNotBeCalled)
      .finally(done);
  });

  it('should wrap info', function(done) {
    function success(response) {
      expect(response.db_name).toBe('db');
    }
    db.info()
      .then(success)
      .catch(shouldNotBeCalled)
      .finally(done);
  });

  it('should wrap compact', function(done) {
    db.compact()
      .then(shouldBeOK)
      .catch(shouldNotBeCalled)
      .finally(done);
  });

  it('should wrap revsDiff', function(done) {
    var diff = {
      test: ['1']
    };
    function success(response) {
      expect(response.test.missing[0]).toBe('1');
    }
    db.revsDiff(diff)
      .then(success)
      .catch(shouldNotBeCalled)
      .finally(done);
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
