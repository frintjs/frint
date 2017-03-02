# react-server

> Server-side React plugin for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)
  - [renderToString](#rendertostring)

<!-- /MarkdownTOC -->

## Installation

This plugin is not set up in the library by default, since we don't want it to be available in the browser.

To load it up:

```js
const Frint = require('frint');
const FrintReactServer = require('frint/lib/react-server');

Frint.use(FrintReactServer);
```

## Usage

```js
const { renderToString } = Frint; // `renderToString` is available via the plugin

// import your App
const App = require('./path/to/core');
const app = new App();

const htmlOutput = renderToString(app);
```

---

# API

## renderToString

> renderToString(app)

### Arguments

1. `app` (`App`): The Core App or Widget's instance

### Returns

`String`: HTML output as a string.
