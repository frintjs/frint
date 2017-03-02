# frint

> The base of Frint

<!-- MarkdownTOC autolink=true bracket=round -->

  - [Usage](#usage)
  - [Terminologies](#terminologies)
  - [Plugins](#plugins)
- [API](#api)
  - [use](#use)

<!-- /MarkdownTOC -->

## Usage

```js
const Frint = require('frint');
```

## Terminologies

* `Plugin`: Modules that extend the core framework.

## Plugins

Plugins help extend the core of the framework.

### Installation

Plugins can be installed as follows:

```js
const Frint = require('frint');
const FooPlugin = require('frint-plugin-foo');

Frint.use(FooPlugin);
```

### Development

A plugin in its simplest form, is an object exposing a `install` function. The function accepts `Frint`, which can be extended further from there.

```js
// frint-plugin-foo/index.js
module.exports = {
  install: function (Frint, options = {}) {
    // extend `Frint` here
  }
};
```

---

# API

## use

> use(Plugin, options = {})

### Arguments

1. `Plugin` (`Object` [required])
2. `options` (`Object` [optional])

### Returns

`void`
