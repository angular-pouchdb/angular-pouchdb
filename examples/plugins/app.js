'use strict';

angular.module('app', [
  'pouchdb'
])
  .config(function(pouchDBProvider, POUCHDB_DEFAULT_METHODS) {
    pouchDBProvider.methods = POUCHDB_DEFAULT_METHODS.concat([
      'login'
    ]);
  })
  .controller('ExampleCtrl', function($scope, pouchDB) {
    var db = pouchDB('example');

    $scope.login = function() {
      db.login()
        .then(function(response) {
          $scope.response = response;
        })
        .catch(function(response) {
          $scope.response = response;
        });
    };
  });
