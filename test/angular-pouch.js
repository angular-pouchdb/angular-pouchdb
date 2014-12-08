'use strict';

describe('Angular PouchDB', function() {
  beforeEach(module('pouchdb'));

  var db;
  beforeEach(inject(function(pouchDB) {
    db = pouchDB('db');
  }));

  function allKeys(obj) {
    var keys = [];
    // Include everything in the prototype chain
    for (var key in obj) {
      keys.push(key);
    }
    return keys;
  }

  it('should not introduce new instance methods', function() {

    var $window;
    inject(function(_$window_) {
      $window = _$window_;
    });

    var raw = new $window.PouchDB('raw');
    var rawKeys = allKeys(raw);

    var dbKeys = allKeys(db);

    var result = dbKeys.every(function(key) {
      return rawKeys.indexOf(key) !== -1;
    });

    expect(result).toBe(true);
  });

  it('should include all known public methods', function() {
    var methods = [
      'destroy',
      'put',
      'post',
      'get',
      'remove',
      'bulkDocs',
      'allDocs',
      'changes',
      'replicate',
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

    var dbKeys = allKeys(db);

    var result = methods.every(function(method) {
      return dbKeys.indexOf(method) !== -1;
    });

    expect(result).toBe(true);
    expect(db.replicate.to).toBeDefined();
    expect(db.replicate.from).toBeDefined();
  });

  it('should resolve a DB post', function() {
    runs(function() {
      return db.post({})
        .then(function(result) {
          expect(result.ok).toBe(true);
        });
    });
  });

  afterEach(function() {
    runs(function() {
      return db.destroy()
        .then(function(result) {
          expect(result.ok).toBe(true);
        });
    });
  });
});
