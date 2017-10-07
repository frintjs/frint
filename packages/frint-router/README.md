# frint-router

[![npm](https://img.shields.io/npm/v/frint-router.svg)](https://www.npmjs.com/package/frint-router)

> Router package for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)
  - [BrowserRouterService](#browserrouterservice)
  - [HashRouterService](#hashrouterservice)
  - [MemoryRouterService](#memoryrouterservice)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-router
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://unpkg.com/frint-router@latest/dist/frint-router.min.js"></script>

<script>
  // available as `window.FrintRouter`
</script>
```

## Usage

The classes exported by this package are all independent and can be used as is.

```js
import HashRouterService from 'frint-router/HashRouterService';
// import BrowserRouterService from 'frint-router/BrowserRouterService';
// import MemoryRouterService from 'frint-router/MemoryRouterService';

const router = new HashRouterService();
const subscription = router.getHistory$().subscribe(function (history) {
  console.log(history);
  // {
  //   length: 1,
  //   location: { ... }, // Object liked `window.location`
  //   action: 'PUSH',
  // }
});
```

The subscription will keep emitting new values every time there is a change in history.

### Convention

To connect it well with other packages, we need to follow a convention of using the provider name `router`:

```js
import { createApp } from 'frint';
import HashRouterService from 'frint-router/HashRouterService';

const RootApp = createApp({
  name: 'MyRootApp',
  providers: [
    {
      name: 'router',
      useFactory: function () {
        return new HashRouterService();
      },
      cascade: true,
    }
  ],
});
```

### Direct imports

It is advised to import the appropriate router service class directly from the package, to make sure you are only bundling the services you explicitly need.

```js
// will bundle only the individual HashRouterService
import HashRouterService from 'frint-router/HashRouterService';

// will bring ALL the service classes
import { HashRouterService } from 'frint-router';
```

---

# API

The package exports three classes:

* `BrowserRouterService`: uses HTML5 History API
* `HashRouterService`: For legacy browsers
* `MemoryRouterService`: useful for tests

All of them implement the same set of methods.

## BrowserRouterService

### constructor

#### Arguments

1. `options` (`Object`)
  * `options.enableCache` (`Boolean`): Enables caching, set to `true` by default.
  * `options.cacheLimit` (`Number`): Maximum limit of entries to cache, set to `10000` by default.

### getHistory$

> getHistory$()

Streams history as it changes over time.

#### Returns

`Observable`: Streams `history` Object.

Structure of `history` object:

```js
{
  length: 1, // number of entries
  location: { ... }, // like `window.location`
  action: 'PUSH' // either PUSH, REPLACE, or POP
}
```

### getMatch$

> getMatch$(pattern, options)

Keeps matching pattern against history as it keeps changing over time.

#### Arguments

1. `pattern` (`String`): Pattern to match against
1. `options` (`Object`)
  * `options.exact` (`Boolean`): Matches pattern exactly, defaults to `false`.

#### Returns

`Observable`: Streams `null` if nothing matched, otherwise a matched object.

A matched object follows this structure:

```js
{
  url: '/',
  isExact: true,
  params: {
    key: 'value',
  }
}
```

### getMatch

> getMatch(pattern, history, options)

Synchronous way of matching `pattern` against provided `history`.

#### Arguments

1. `pattern` (`String`): Pattern to match against
1. `history` (`Object`): History object
1. `options` (`Object`)
  * `options.exact` (`Boolean`)

#### Returns

Returns `null` when nothing matched, or a matched object.

### go

> go(n)

#### Arguments

1. `n` (`Number`)

#### Returns

`void`

### push

> push(path, state)

#### Arguments

1. `path` (`String`)
1. `state` (`Object`)

#### Returns

`void`

### replace

> replace(path, state)

#### Arguments

1. `path` (`String`)
1. `state` (`Object`)

#### Returns

`void`

### goBack

> `goBack()`

Equivalent to `go(-1)`

#### Returns

`void`

### goForward

> goForward()

#### Returns

`void`

## HashRouterService

Same as above.

## MemoryRouterService

Same as above.
