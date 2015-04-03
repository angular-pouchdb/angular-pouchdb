'use strict';

angular.module('examples.replicate', [
  'ui.router',
  'pouchdb'
])
  .config(function($stateProvider) {
    $stateProvider.state('examples.example.replicate', {
      url: '/replicate',
      templateUrl: 'examples/replicate/replicate.html',
      controller: 'ReplicateCtrl',
      data: {
        label: 'Replicate'
      }
    });
  });
