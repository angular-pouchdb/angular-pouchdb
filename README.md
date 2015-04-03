# angular-pouchdb

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

> AngularJS wrapper for PouchDB

A lightweight AngularJS service for PouchDB that;

* Wraps Pouch's methods with `$q`
* Makes Angular aware of asynchronous updates (via `$rootScope.$apply`)

[travis-image]: https://img.shields.io/travis/angular-pouchdb/angular-pouchdb.svg
[travis-url]: https://travis-ci.org/angular-pouchdb/angular-pouchdb
[coveralls-image]: https://img.shields.io/coveralls/angular-pouchdb/angular-pouchdb.svg
[coveralls-url]: https://coveralls.io/r/angular-pouchdb/angular-pouchdb

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

See [examples][] for further usage examples.

[examples]: https://angular-pouchdb.github.io/angular-pouchdb/#/examples

## Options

The list of methods to be wrapped with a decorator can be customised by injecting
the `pouchDBProvider` in an `angular.config` block, for example:

```js
.config(function(pouchDBProvider, POUCHDB_METHODS) {
  // Example for pouchdb-authentication
  var authMethods = {
    login: 'qify',
    logout: 'qify',
    getUser: 'qify'
  };
  pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, authMethods);
})
```

See the [plugin example][plugins] for a working example.

[plugins]: https://angular-pouchdb.github.io/angular-pouchdb/#/examples/plugins

## Authors

* © 2013-2014 Wilfred Springer <http://nxt.flotsam.nl>
* © 2014-2015 Tom Vincent <http://tlvince.com/contact>

## License

Released under the MIT License.
