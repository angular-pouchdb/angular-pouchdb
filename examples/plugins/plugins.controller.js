'use strict';

angular.module('examples.plugins')
  .config(function(pouchDBProvider, POUCHDB_METHODS) {
    // Example for pouchdb-authentication
    var authMethods = {
      login: 'qify'
    };
    pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, authMethods);
  })
  .controller('PluginsCtrl', function($scope, $state, pouchDB) {
    var db = pouchDB($state.current.name);

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
