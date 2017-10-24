# frint-model

[![npm](https://img.shields.io/npm/v/frint-model.svg)](https://www.npmjs.com/package/frint-model)

> Model package for Frint

# WARNING: This package has been deprecated!

Use [`frint-data`](https://frint.js.org/docs/packages/frint-data/) instead.

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Terminologies](#terminologies)
  - [Usage](#usage)
- [API](#api)
  - [Model](#model)
  - [createModel](#createmodel)
  - [model](#model-1)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-model
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.5.0/Rx.min.js"></script>

<script src="https://unpkg.com/frint-model@latest/dist/frint-model.min.js"></script>

<script>
  // available as `window.FrintModel`
</script>
```

## Terminologies

* `Model`: An object that holds data, e.g. configuration, customer information, etc.
* `attributes`: The actual data in plain object, which is fed to the Model during construction.

## Usage

Let's import the necessary function from the library first:

```js
import { createModel } from 'frint-model';
```

Now we can create our Model:

```js
const Shirt = createModel({
  getColor: function () {
    return this.get('color');
  },
  getSize: function () {
    return this.get('size');
  },
});
```

Building a new model instance object:

```js
const shirt = new Shirt({
  color: 'blue',
  size: 'medium',
});

const color = shirt.getColor(); // blue
const size = shirt.getSize();   // medium
```

The model instance can also be observed for changes:

```js
shirt.get$().subscribe(function (shirtAttributes) {
  // triggered when the model had any change
});

shirt.get$('color').subscribe(function (color) {
  // triggered when the model's `color` key changes
});
```

---

# API

## Model

> Model

The base Model class.  You can extend the base Model class freely to your own like.

### Example

```js
import { Model } from 'frint-model';

export default class Shirt extends Model {
  getColor() {
    return this.get('color');
  }

  getSize() {
    return this.get('size');
  }
}
```

## createModel

> createModel(extend)

Creates and returns an ES6 compatible class.  Useful in non-ES6 compatible environments.

### Arguments

1. `extend` (`Object`): An object with the functions to extend the base Model class with.

### Returns

`Function`: ES6 compatible class.

### Example

```js
const Shirt = createModel({
  getColor: function () {
    return this.get('color');
  },
  getSize: function () {
    return this.get('size');
  },
});
```

## model

> const model = new Model();

The `Model` instance

### model.get

> model.get(key)

#### Arguments

1. `key` (`String`): Can be dot separated, like `deep.nested.path`. If empty, it returns all the attributes.

#### Returns

`Any`: The key's value.

### model.set

> model.set(key, value)

Sets the `value` for given `key` in the model.

#### Arguments

1. `key` (`String`)
1. `value` (`Any`)

#### Returns

`void`.

### get$

> get$(key)

Streams the model for given key.

#### Arguments

1. `key` (`String`)

#### Returns

`Observable`.
