# angular-pouchdb

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

> AngularJS wrapper for PouchDB

A lightweight AngularJS service for PouchDB that:

* Wraps Pouch's methods with `$q`
* Makes Angular aware of asynchronous updates

[travis-image]: https://img.shields.io/travis/angular-pouchdb/angular-pouchdb.svg
[travis-url]: https://travis-ci.org/angular-pouchdb/angular-pouchdb
[coveralls-image]: https://img.shields.io/coveralls/angular-pouchdb/angular-pouchdb.svg
[coveralls-url]: https://coveralls.io/r/angular-pouchdb/angular-pouchdb

## Why?

Since PouchDB is asynchronous, you will often need to call `$scope.$apply()`
before changes are reflected on the UI. For example:

```js
angular.controller('MyCtrl', function($scope, $window) {
  var db = $window.PouchDB('db');
  db.get('id')
    .then(function(res) {
      // Binding may/may not be updated depending on whether a digest cycle has
      // been triggered elsewhere as Angular is unaware that `get` has resolved.
      $scope.one = res;
    });

  var db2 = $window.PouchDB('db2');
  db.get('id')
    .then(function(res) {
      $scope.$apply(function() {
        // Value has been bound within Angular's context, so a digest will be
        // triggered and the DOM updated
        $scope.two = res;
      });
    });
});
```

Writing `$scope.$apply` each time is laborious and we haven't even mentioned
exception handling or `$digest already in progress` errors.

angular-pouchdb handles `$scope.$apply` for you by wrapping PouchDB's promises
with `$q`. You can then use its promises as you would with any Angular promise,
including the `.finally` method (not in the A+ spec).

```js
angular.controller('MyCtrl', function($scope, pouchDB) {
  var db = pouchDB('db');
  db.get('id')
    .then(function(res) {
      // Update UI (almost) instantly
      $scope.one = res;
    })
    .catch(function(err) {
      $scope.err = err;
    })
    .finally(function() {
      $scope.got = true;
    });
});
```

Put another way, angular-pouchdb is **not** required to integrate PouchDB and
AngularJS; they can and *do* happily work together without it. However,
angular-pouchdb makes it more *convenient* to do so.

## Usage

1. Install `angular-pouchdb` via Bower:

    ```bash
    bower install --save angular-pouchdb
    ```

2. Add `pouchdb` as a module dependency:

    ```js
    angular.module('app', ['pouchdb']);
    ```

3. Inject the `pouchDB` service in your app:

    ```js
    angular.service('service', function(pouchDB) {
      var db = pouchDB('name');
    });
    ```

From then on, PouchDB's standard *promises* [API][] applies. For example:

```js
angular.controller('MainCtrl', function($log, $scope, pouchDB) {
  var db = pouchDB('dbname');
  var doc = { name: 'David' };

  function error(err) {
    $log.error(err);
  }

  function get(res) {
    if (!res.ok) {
      return error(res);
    }
    return db.get(res.id);
  }

  function bind(res) {
    $scope.doc = res;
  }

  db.post(doc)
    .then(get)
    .then(bind)
    .catch(error);
});
```

See [examples][] for further usage examples.

[api]: http://pouchdb.com/api.html
[examples]: https://angular-pouchdb.github.io/angular-pouchdb/#/examples

### Event emitters

angular-pouchdb decorates PouchDB event emitters (such as those used by
`replicate.{to,from}`) to make them more useful within Angular apps, per the
following mapping:

Event      | [Deferred method][]
-----      | -------------------
`change`   | `.notify`
`paused`   | `.notify`
`complete` | `.resolve`
`reject`   | `.reject`

[deferred method]: https://docs.angularjs.org/api/ng/service/$q#the-deferred-api

## Options

### `pouchDBProvider.methods`

A hash of `pouchDBMethod: decorator` pairs, with arbitrary nesting. Defaults to
[POUCHDB_METHODS][] (a constant mapping PouchDB's core API).

Example:

```js
pouchDBProvider.methods = {
  get: 'qify',
  replicate: {
    to: 'eventEmitter'
  }
};
```

[pouchdb_methods]: https://github.com/angular-pouchdb/angular-pouchdb/blob/master/angular-pouchdb.js#L4

### `pouchDBDecorators`

A service containing decorator functions used to wrap PouchDB's. By default,
this includes `qify` and `eventEmitter`.

Since they're contained in a service, they can be substituted per standard
dependency injection semantics, or reused outside of angular-pouchdb.

## FAQ

### Does this work with PouchDB plugins?

angular-pouchdb only wraps PouchDB's core API by default. If you need to wrap
other methods (for example, one exposed by a PouchDB plugin), there are (at
least) two strategies:

If the method exists synchronously, add the method name to
`pouchDBProvider.methods` in an `angular.config` block, for example:

```js
.config(function(pouchDBProvider, POUCHDB_METHODS) {
  // Example for nolanlawson/pouchdb-authentication
  var authMethods = {
    login: 'qify',
    logout: 'qify',
    getUser: 'qify'
  };
  pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, authMethods);
})
```

If the method is added after instantiation asynchronously (perhaps via
a promise), manually apply a [decorator][] to the instance, for example:

```js
.controller('myCtrl', function(pouchDB, pouchDBDecorators) {
  // Example for nolanlawson/pouchdb-find
  var db = pouchDB('db');
  db.find = pouchDBDecorators.qify(db.find);
});
```

[decorator]: #pouchdbdecorators

### How can I debug this?

Debugging angular-pouchdb in a console can be done by first retrieving the
injector and calling the `pouchDB` service as normal, e.g.:

```js
var pouchDB = angular.element(document.body).injector().get('pouchDB');
var db = pouchDB('mydb');
db.get('id').then();
```

For further tips and tricks, see [CouchDB Best Practices][best-practices].

[best-practices]: http://docs.ehealthafrica.org/couchdb-best-practices/

### Can this be used with Browserify?

Yes! For example:

```js
require('angular').module('app', [
  require('angular-pouchdb')
]);
```

## Authors

* © 2013-2014 Wilfred Springer <http://nxt.flotsam.nl>
* © 2014-2015 Tom Vincent <https://tlvince.com/contact>

## License

Released under the [MIT License][mit].

[mit]: http://tlvince.mit-license.org
