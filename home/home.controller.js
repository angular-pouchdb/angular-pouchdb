'use strict';

angular.module('home')
  .controller('HomeCtrl', function($http, $scope) {
    var req = {
      method: 'GET',
      url: 'https://api.github.com/repos/angular-pouchdb/angular-pouchdb/readme',
      headers: {
        'Accept': 'application/vnd.github.v3.html+json'
      }
    };

    function error(err) {
      var msg = 'Could not load readme';
      if (err.data && err.data.message) {
        msg += ': ' + err.data.message;
      }
      $scope.readme = msg;
    }

    function success(res) {
      if (!res.data) {
        error();
        return;
      }
      $scope.readme = res.data;
    }

    $http(req)
      .then(success)
      .catch(error);
  });
