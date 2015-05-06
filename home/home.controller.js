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
      $scope.error = err;
    }

    function success(res) {
      if (!res.data) {
        error(res);
        return;
      }
      $scope.readme = res.data;
    }

    $http(req)
      .then(success)
      .catch(error);
  });
