'use strict';

angular.module('home', [
  'ngSanitize',
  'ui.router'
])
  .config(function($stateProvider) {
    $stateProvider.state('home', {
      url: '/',
      parent: 'root',
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl'
    });
  });
