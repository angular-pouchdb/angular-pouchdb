'use strict';

angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'home',
  'examples'
])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('root', {
      abstract: true,
      views: {
        navbar: {
          templateUrl: 'navbar.html',
          controller: 'NavbarCtrl'
        },
        content: {}
      }
    });
  });
