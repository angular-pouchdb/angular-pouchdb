'use strict';

angular.module('examples.replicate')
  .controller('ReplicateCtrl', function($log, $scope, $state, pouchDB) {
    var db = pouchDB($state.current.name);

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
