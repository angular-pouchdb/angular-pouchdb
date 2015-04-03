'use strict';

angular.module('examples')
  .controller('ExamplesIndexCtrl', function($scope, examples) {
    $scope.examples = examples.all();
  });
