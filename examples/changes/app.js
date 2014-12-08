'use strict';

angular.module('app', [
  'pouchdb'
])
  .controller('ExampleCtrl', function($scope, pouchDB) {
    var db = pouchDB('example');

    $scope.docs = [];

    $scope.add = function() {
      db.post({
        date: new Date().toJSON()
      });
    };

    function onChange(change) {
      $scope.docs.push(change.doc);
    }

    db.changes({
      /*eslint-disable camelcase */
      include_docs: true,
      /*eslint-enable camelcase */
      continuous: true,
      onChange: onChange
    });
  });
