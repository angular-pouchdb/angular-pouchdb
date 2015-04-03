'use strict';

angular.module('examples.changes', [
  'ui.router',
  'pouchdb',
])
  .config(function($stateProvider) {
    $stateProvider.state('examples.example.changes', {
      url: '/changes',
      templateUrl: 'examples/changes/changes.html',
      controller: 'ChangesCtrl',
      data: {
        label: 'Changes'
      }
    });
  });
