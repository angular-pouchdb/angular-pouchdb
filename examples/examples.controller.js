'use strict';

angular.module('app')
  .controller('ExamplesCtrl', function($q, $http, $scope, $state) {
    $scope.state = $state;

    $scope.isCollapsed = true;
    $scope.toggleSource = function() {
      if (!$scope.isCollapsed) {
        $scope.isCollapsed = !$scope.isCollapsed;
        return;
      }

      var html = $state.current.templateUrl;
      var js = html.replace(/\.html$/, '.controller.js');

      var promises = {
        js: $http.get(js),
        html: $http.get(html)
      };

      $q.all(promises)
        .then(function(res) {
          $scope.source = res;
        })
        .catch(function(err) {
          $scope.source = {
            err: err
          };
        })
        .finally(function() {
          $scope.isCollapsed = !$scope.isCollapsed;
        });
    };
  });
