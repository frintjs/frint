---
title: Code splitting across multiple bundles
sidebarPartial: guidesSidebar
---

# Code splitting across multiple bundles

<!-- MarkdownTOC depth=2 autolink=true bracket=round -->

- [What is code splitting](#what-is-code-splitting)
- [The bundles](#the-bundles)
- [Illustration](#illustration)
- [Install dependencies](#install-dependencies)
- [Vendors bundle](#vendors-bundle)
- [Externals](#externals)
- [App bundles](#app-bundles)
- [Apps](#apps)

<!-- /MarkdownTOC -->

## What is code splitting

Imagine you have a very large application. And you have your application divided into multiple apps. And not all apps need to be served to the browser at the same time since they target different pages.

To serve them individually, we can bundle them separately and load them independently via `<script>` tags.

## The bundles

We can divide our bundles like this:

* `vendors.js`: contains Lodash, RxJS, Frint, etc
* `root.js`: our Root app's bundle
* `app-foo.js`: App Foo's bundle
* `app-bar.js`: App Bar's bundle
* etc...

We also want to make sure that our root and app bundles would not duplicate any of the libraries that we already have in `vendors.js`.

## Illustration

![code splitting](/img/frint-code-splitting.png)

Illustration of a multiple bundles loading themselves in the browser, and then rendering the final output.

We will see some code examples below.

## Install dependencies

First the vendors:

```
$ npm install --save lodash rxjs react react-dom prop-types frint frint-store frint-model frint-react
```

And the devDependencies for bundling:

```
$ npm install --save babel-core babel-loader babel-preset-travix webpack
```

## Vendors bundle

Goal is to generate a `vendors.js` file, which once loaded in the browser would expose the dependencies directly under `window` object.

The entry file for the budle can look something like this:

```js
// vendors_entry.js
window._ = require('lodash');
window.Rx = require('rxjs');

window.React = require('react');
window.ReactDOM = require('react-dom');

window.Frint = require('frint');
window.FrintStore = require('frint-store');
window.FrintModel = require('frint-model');
window.FrintReact = require('frint-react');
```

The webpack configuration may look something like this:

```js
// vendors-webpack.config.js
module.exports = {
  entry: __dirname + '/vendors_entry.js',
  output: {
    path: __dirname + '/build/js',
    filename: 'vendors.js'
  }
};
```

Running this command now would generate a new file at `./build/vendors.js`:

```
$ ./node_modules/.bin/webpack --config ./vendors-webpack.config.js
```

## Externals

We can create a file for listing all our dependencies' names, that we can reuse in webpack configuration for our App bundles:

```js
// externals.js
module.exports = {
  // npm package name => name under `window` in browser

  'lodash': '_',
  'rxjs': 'Rx',

  'react': 'React',
  'react-dom': 'ReactDOM',

  'frint': 'Frint',
  'frint-store': 'FrintStore',
  'frint-model': 'FrintModel',
  'frint-react': 'FrintReact'
};
```

## App bundles

Webpack config for your root app may look like this:

```js
// root-webpack.config.js
const externals = require('./externals');

module.exports = {
  entry: __dirname + '/path/to/root/app/entry',
  output: {
    path: __dirname + '/build',
    filename: 'root.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        query: {
          presets: [
            'travix'
          ]
        }
      }
    ]
  },

  // we reuse the same externals list across all configuration files
  externals: externals,
};
```

Running this command would then generate `./build/rootApp.js` file:

```
$ ./node_modules/.bin/webpack --config root-webpack.config.js
```

The entry file of your root app may look like this:

```js
import { render } from 'frint-react';

import App from './app';

window.app = new App();
render(window.app, document.getElementById('root'));
```

## Apps

Apps bundling can follow the same approach as root app bundling like above.

The entry file of an App may look like this:

```js
import App from './app';

window.app.registerApp(App, {
  regions: ['sidebar']
});
```
