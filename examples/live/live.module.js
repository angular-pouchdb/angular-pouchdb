'use strict';

angular.module('examples.live', [
  'ui.router',
  'pouchdb'
])
  .config(function($stateProvider) {
    $stateProvider.state('examples.example.live', {
      url: '/live',
      templateUrl: 'examples/live/live.html',
      controller: 'LiveCtrl',
      data: {
        label: 'Live'
      }
    });
  });
