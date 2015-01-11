'use strict';

angular.module('app', [
  'pouchdb'
])
  .controller('ExampleCtrl', function($log, $scope, pouchDB) {
    var db = pouchDB('example');

    $scope.remote = 'local-test';

    function updateStatus(response) {
      $log.info(response);
      $scope.status = JSON.stringify(response);
    }

    $scope.replicate = function() {
      db.post({
        date: new Date().toJSON()
      });
      db.replicate.to($scope.remote).$promise
        .then(null, null, updateStatus)
        .then(updateStatus)
        .catch(updateStatus);
    };

  });
