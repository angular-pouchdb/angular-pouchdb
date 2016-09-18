# angular-pouchdb

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

> AngularJS v1.x wrapper for PouchDB

A lightweight AngularJS (v1.x) service for PouchDB that:

* Wraps Pouch's methods with `$q`
* Makes Angular aware of asynchronous updates

**Disclaimer**: angular-pouchdb works by [monkey patching][] PouchDB's public
API. Your milage may vary.

[travis-image]: https://img.shields.io/travis/angular-pouchdb/angular-pouchdb.svg
[travis-url]: https://travis-ci.org/angular-pouchdb/angular-pouchdb
[coveralls-image]: https://img.shields.io/coveralls/angular-pouchdb/angular-pouchdb.svg
[coveralls-url]: https://coveralls.io/r/angular-pouchdb/angular-pouchdb
[monkey patching]: https://en.wikipedia.org/wiki/Monkey_patch

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
including the `.finally` method (not in the [Promises A+ spec][a+]).

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

[a+]: https://promisesaplus.com/

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
`replicate.{to,from}`) with a `.$promise` property to make them more useful
within Angular apps, per the following mapping:

Event      | [Deferred method][]
-----      | -------------------
`change`   | `.notify`
`paused`   | `.notify`
`complete` | `.resolve`
`reject`   | `.reject`

For example:

```js
var db = pouchDB('test');
db.replicate.to('https://couch.example.com/remote').$promise
  .then(null, null, function(progress) {
    console.log('replication status', progress);
  })
  .then(function(result) {
    console.log('replication resolved with', result);
  })
  .catch(function(reason) {
    console.error('replication failed with', reason);
  })
  .finally(function() {
    console.log('done');
  });
```

[deferred method]: https://docs.angularjs.org/api/ng/service/$q#the-deferred-api

## Options

### `pouchDBProvider.methods`

A hash of `pouchDBMethod: decorator` pairs, with arbitrary nesting. Defaults to
[POUCHDB_METHODS][] (a constant mapping PouchDB's core API).

Example:

```js
pouchDBProvider.methods = {
  get: 'qify',
  replicate: 'replicate'
};
```

[pouchdb_methods]: https://github.com/angular-pouchdb/angular-pouchdb/blob/master/angular-pouchdb.js#L4

### `pouchDBDecorators`

A service containing decorator functions used to wrap PouchDB's. By default,
this includes `qify`, `eventEmitter` and `replicate`.

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

[best-practices]: http://ehealthafrica.github.io/couchdb-best-practices/

### Can this be used with Browserify?

Yes! For example:

```js
require('angular').module('app', [
  require('angular-pouchdb')
]);
```

### Can this be used with webpack?

Yes, though you need to use [expose-loader][] to ensure PouchDB is available as
a global, for example:

```js
require('expose?PouchDB!pouchdb');
```

[expose-loader]: https://github.com/webpack/expose-loader

### Why do promises timeout in my test suite?

*Note*: some (or all) parts of this section may be incorrect or misleading.
Your input is welcome.

In short, AngularJS uses a different task scheduler than native promises.

Promises can be implemented differently. PouchDB uses native ([A+][]-compliant)
promises (or [lie][] in environments without native support). Native promises
are scheduled using "the microtask queue". AngularJS uses its own promise
implementation; `$q`, which are scheduled via `$evalAsync`.

During normal use, PouchDB's (wrapped) promise is resolved correctly. However
during testing, suites that use `ngMock` (`angular-mocks`) often unexpectedly
timeout.

Typically, `$rootScope.$apply()` is used to propagate promise resolution in
asynchronous tests. This triggers a digest cycle, which in turn flushes
Angular's `asyncQueue`. Whilst this resolves `$q` promises, it does not resolve
PouchDB's native promises, hence causing the test runner (e.g. Karma) to
timeout.

Until Angular's promise implementation is decoupled from its digest cycle and/or
Angular-specific implementations can be swapped out with their native
equivalents, there are a few known workarounds:

[lie]: https://github.com/calvinmetcalf/lie

#### Do not use `ngMock`

`ngMock` modifies Angular's deferred implementation in order to support writing
tests in a synchronous manner. Arguably, this simplifies control flow, but comes
at the cost of making `$q`-wrapped promises difficult to test.

One workaround (and the one that `angular-pouchdb` currently uses) is to not
use `ngMock` and manually handle `$injector`, for example:

```js
describe('Working $q.when tests', function() {
  var pouchdb;
  beforeEach(function() {
    // Note, `ngMock` would usually inject `ng` for us
    var $injector = angular.injector(['ng', 'test']);
    var pouchDB = $injector.get('pouchdb');
    pouchdb = pouchDB('db');
  });

  it('should resolve a promise', function(done) {
    pouchdb.info()
      .then(function(info) {
        expect(info).toBeDefined();
      })
      .finally(done);
  });
});
```

This preserves "normal" promise resolution behaviour, but will not suit all
scenarios, such as when you need the additional introspection/async control
features `ngMock` provides e.g. `$httpBackend.flush`.

#### Spam `$rootScope.$apply`

Calling `$rootScope.$apply` in quick succession to cause a near-continuous
digest cycle forces promise resolution. This appears to be due to tight coupling
between Angular's promises and its digest cycle.

```js
it('should wrap destroy', function(done) {
  // Note, you might want to experiement with a interval timeout here
  var interval = $window.setInterval($rootScope.$apply.bind());
  db.destroy()
    .then(shouldBeOK)
    .then($window.clearInterval.bind(null, interval))
    .catch(shouldNotBeCalled)
    .finally(done);
})
```

Note, this is likely to significantly decrease your test's performance.

### Does this work with Angular v2?

No and it doesn't need to! Angular v2's concept of change detection completely
differs to Angular v1's; the digest cycle, `$scope.$apply` and friends are no
more. Just use PouchDB directly.

## Authors

* © 2013-2014 Wilfred Springer <http://nxt.flotsam.nl>
* © 2014-2016 Tom Vincent <https://tlvince.com/contact>

## License

Released under the [MIT License][mit].

[mit]: http://tlvince.mit-license.org
