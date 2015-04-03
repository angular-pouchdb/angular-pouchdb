'use strict';

angular.module('examples.plugins', [
  'ui.router',
  'pouchdb'
])
  .config(function($stateProvider) {
    $stateProvider.state('examples.example.plugins', {
      url: '/plugins',
      templateUrl: 'examples/plugins/plugins.html',
      controller: 'PluginsCtrl',
      data: {
        label: 'Plugins'
      }
    });
  });
