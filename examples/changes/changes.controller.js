'use strict';

angular.module('examples.changes')
  .controller('ChangesCtrl', function($scope, $state, pouchDB) {
    var db = pouchDB($state.current.name);

    $scope.docs = [];

    $scope.add = function() {
      db.post({
        date: new Date().toJSON()
      });
    };

    function onChange(change) {
      $scope.docs.push(change);
    }

    var options = {
      /*eslint-disable camelcase */
      include_docs: true,
      /*eslint-enable camelcase */
      live: true
    };

    db.changes(options).$promise
      .then(null, null, onChange);
  });
