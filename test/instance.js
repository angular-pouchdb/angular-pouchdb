'use strict';

describe('angular-pouchdb instance', function() {
  var db;

  beforeEach(function() {
    var $injector = angular.injector(['ng', 'pouchdb']);
    var pouchDB = $injector.get('pouchDB');
    db = pouchDB('db');
  });

  it('should pass through rejections', function(done) {
    function errorHandler(rejection) {
      expect(rejection).toBeDefined();
    }
    db.put()
      .catch(errorHandler)
      .finally(done);
  });
});
