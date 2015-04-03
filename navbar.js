'use strict';

angular.module('app')
  .controller('NavbarCtrl', function($scope, examples) {
    $scope.examples = examples.all();
  });
