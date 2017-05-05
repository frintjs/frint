# model

> Model package for Frint

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
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.0.1/Rx.min.js"></script>

<script src="https://unpkg.com/frint-model@latest/dist/frint-model.min.js"></script>

<script>
  // available as `window.FrintModel`
</script>
```

## Terminologies

* `Model`: An object that holds data, e.g. configuration, customer information, etc.
* `attributes`: The actual data in plain object, which is fed to the Model during construction.
* `Schema`: An object containing metadata regarding the model, such as default values and validation rules.

## Basic model usage

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

## Model schema

A common usecase is to be able to make sure that models conform to a certain set of business rules. At the same time, we'd like to be able simplify syntax of our models and take away some code repetition that can happen in certain use cases.

For this reason, a `Schema` can be defined that describes various details of the model, particularly:

* Field types
* Default values of fields
* Validation rules (both singular and composite rules)

Let's start with a very basic schema.

```js
import { createSchema } from 'frint-model';

const schemaDefinition = {
  color: {
    default: 'blue'
  },
  size: {
    default: 'medium'
  },
}
const shirtSchema = createSchema(schemaDefinition);
```

This defines a very simple schema, where we specify that the model will have a `color` and `size` property. Both field type is not defined and will fall back to the default type of `string`. We also specify that the field will have a default value, `blue` and `medium`.

Now, let's create a model and apply the schema to it. We do this by calling `createModel` and specifying a `schema` property.

```js
import { createModel } from 'frint-model';

const Shirt = createModel({
  schema: shirtSchema
});
```

Note how we use a reserved property named `schema` to specify that the model `Shirt` has the `shirtSchema` schema. Also note how nothing else is defined, unlike earlier samples. Since the schema has defined which properties exist, specifying the schema during model creation means we will have initialized the model according to the schema. Let's try it:

```js
const shirt = new Shirt();
const color = shirt.getColor();   // blue
const size = shirt.getSize();     // medium
const color = shirt.get('color'); // blue
const size = shirt.get('size');   // medium
```

Specifically note that:

* We did not provide any explicit model values during the `createModel` call or `new Shirt()`.
* The `getSize` and `getColor` functions have been created automatically.
* The default values have been applied.

## Default values

In the previous example you have seen how a default value can be specified in the schema using the following syntax:

```js
const schema = {
  fieldName: {
    default: .... // Your default value goes here
  }
}
```

The type of the default value must match the field type (see the next section). Note that a default value is not required in the schema and can be specified/omitted per field. If omitted, the default value of the type will be used.

Apart from that, you can also override the default value during model creation.

```js
const shirt = new Shirt({ color: red });
const color = shirt.getColor();   // red
const size = shirt.getSize();     // medium
```

## Types

(pending implementation)

| Type | Default value | Details |
| --- | --- | --- |
| string | `''` | - |
| complex | `{}`| Nested complex type, anonymous |
| of | `{}` | Nested complex type, named |
| collectionOf | `[]` | Collection of the specified type |

## Validation

(pending implementation)

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
