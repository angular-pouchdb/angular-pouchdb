'use strict';

describe('angular-pouchdb provider', function() {
  it('should expose a map of method -> wrapFunction', function() {
    module('pouchdb');
    inject(function(POUCHDB_METHODS) {
      expect(angular.isObject(POUCHDB_METHODS)).toBe(true);
    });
  });

  it('should expose a methods property', function() {
    module('pouchdb', function(pouchDBProvider) {
      expect(pouchDBProvider.methods).toBeDefined();
    });
  });

  it('should support a custom methods list', function() {
    module('pouchdb', function(pouchDBProvider) {
      pouchDBProvider.methods = {
        info: 'qify',
        replicate: {
          to: 'eventEmitter',
          from: 'eventEmitter'
        },
        search: 'qify',
        '\uffff': 'qify'
      };
    });
    inject(function(pouchDB) {
      var db = pouchDB('db');
      expect(db.info().finally).toBeDefined();
      expect(db.put().finally).toBeUndefined();
      expect(db.search).toBeDefined();
      expect(db['\uffff']).toBeDefined();
    });
  });
});
