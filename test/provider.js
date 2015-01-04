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
});
