'use strict';

angular.module('examples', [
  'ui.router',
  'hljs',
  'examples.changes',
  'examples.live',
  'examples.plugins',
  'examples.replicate'
])
  .config(function($stateProvider) {
    $stateProvider.state('examples', {
      abstract: true,
      url: '/examples',
      parent: 'root',
      template: '<div ui-view></div>'
    })
    .state('examples.index', {
      url: '',
      controller: 'ExamplesIndexCtrl',
      templateUrl: 'examples/index.html'
    })
    .state('examples.example', {
      url: '',
      abstract: true,
      controller: 'ExamplesCtrl',
      templateUrl: 'examples/examples.html'
    });
  });
