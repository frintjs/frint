# model

> Model package for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Terminologies](#terminologies)
  - [Usage](#usage)
- [API](#api)
  - [Model](#model)
  - [createModel](#createmodel)

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

<script src="https://unpkg.com/frint-store@latest/dist/frint-model.min.js"></script>

<script>
  // available as `window.FrintModel`
</script>
```

## Terminologies

* `Model`: An object class that holds data, e.g. configuration, customer information, etc.

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
