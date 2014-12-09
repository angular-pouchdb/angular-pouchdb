# angular-pouchdb

[![Build Status][travis-image]][travis-url]

> AngularJS wrapper for PouchDB

A lightweight AngularJS service for PouchDB that;

* Wraps Pouch's methods with `$q`
* Makes Angular aware of asynchronous updates (via `$rootScope.$apply`)

[travis-image]: https://travis-ci.org/angular-pouchdb/angular-pouchdb.svg
[travis-url]: https://travis-ci.org/angular-pouchdb/angular-pouchdb

## Usage

1. Install `angular-pouchdb` via Bower:

    ```bash
    bower install --save angular-pouchdb/angular-pouchdb
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

See [examples](examples) for further usage examples.

## Options

The list of methods to be wrapped with `$q` can be customised by injecting the
`pouchDBProvider` in an `angular.config` block, for example:

```js
.config(function(pouchDBProvider, POUCHDB_DEFAULT_METHODS) {
  pouchDBProvider.methods = POUCHDB_DEFAULT_METHODS.concat([
    'login'
  ]);
})
```

See the [plugin example](examples/plugins) for a working example.

## Authors

* © 2013-2014 Wilfred Springer <http://nxt.flotsam.nl>
* © 2014 Tom Vincent <http://tlvince.com/contact>

## License

Released under the MIT License.
