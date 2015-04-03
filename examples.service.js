'use strict';

angular.module('app')
  .service('examples', function($state) {
    this.all = function() {
      function exampleStates(state) {
        return !state.abstract && state.name.indexOf('examples.example') === 0;
      }
      return $state.get().filter(exampleStates);
    };
  });
