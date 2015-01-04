'use strict';

describe('angular-pouchdb provider', function() {
  it('should expose a list constant of wrapped methods', function() {
    module('pouchdb');
    inject(function(POUCHDB_DEFAULT_METHODS) {
      expect(angular.isArray(POUCHDB_DEFAULT_METHODS)).toBe(true);
    });
  });

  it('should expose a methods property', function() {
    module('pouchdb', function(pouchDBProvider) {
      expect(pouchDBProvider.methods).toBeDefined();
    });
  });

  it('should support a custom methods list', function() {
    module('pouchdb', function(pouchDBProvider) {
      pouchDBProvider.methods = ['info'];
    });
    inject(function(pouchDB) {
      var db = pouchDB('db');
      expect(db.info().finally).toBeDefined();
      expect(db.put().finally).toBeUndefined();
    });
  });
});
