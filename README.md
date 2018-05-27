Feed Reader Library for Google Apps Script
==========================================

[![NPM Version][npm-image]][npm-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Linux Build][travis-image]][travis-url]
[![Test Coverage][codecov-image]][codecov-url]

A library for Google Apps Engine to read ATOM feeds.

Features
--------

- Read ATOM feeds via [UrlFetchApp](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app).
  - Currently, ATOM support only.
- Store entries to Spreadsheet.
  - A store is pluggable.  Currently, `SpreadsheetStore` is only implemented.

Requirements
------------

- [gas-webpack-plugin](https://github.com/fossamagna/gas-webpack-plugin)

Setup
-----

1.  Install dependencies

    ```
    $ npm install --save-dev webpack webpack-cli gas-webpack-plugin
    $ npm install gas-feed
    ```

2.  Write `config.webpack.js`

    ```javascript
    const GasPlugin = require("gas-webpack-plugin");

    module.exports = {
      entry: "./src/index.js",
      output: {
        filename: "Code.js",
        path: __dirname + "/built",
      },
      plugins: [
        new GasPlugin(),
      ]
    };
    ```

3.  Write code using `gas-feed`

    ```javascript
    import {FeedReader, SpreadsheetStore} = require("gas-feed");

    function doGet(e) {
      // ...
    }

    // export for gas with gas-webpack-plugin
    global.doGet = doGet;
    ```

4.  Make a `Code.js` via `webpack`

    ```
    $ webpack
    ```

5.  Upload `built/Code.js`

    Copy and paste the content of code simplify or use [`clasp`](https://developers.google.com/apps-script/guides/clasp).

License
-------

Zlib License

Author
------

thinca <thinca+npm@gmail.com>


[npm-image]: https://img.shields.io/npm/v/gas-feed.svg
[npm-url]: https://npmjs.org/package/gas-feed
[node-version-image]: https://img.shields.io/node/v/gas-feed.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://img.shields.io/travis/thinca/gas-feed/master.svg?label=linux
[travis-url]: https://travis-ci.org/thinca/gas-feed
[codecov-image]: https://codecov.io/gh/thinca/gas-feed/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/thinca/gas-feed
