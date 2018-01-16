# frint-data-validation

[![npm](https://img.shields.io/npm/v/frint-data-validation.svg)](https://www.npmjs.com/package/frint-data-validation)

> Reactive data modelling package for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)
  - [validate](#validate)
  - [validate$](#validate-1)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-data frint-data-validation
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.5.0/Rx.min.js"></script>

<script src="https://unpkg.com/frint-data@latest/dist/frint-data.min.js"></script>
<script src="https://unpkg.com/frint-data@latest/dist/frint-data-validation.min.js"></script>

<script>
  // available as `window.FrintDataValidation`
</script>
```

## Usage

Validation rules can be set in two ways using `frint-data-validation`.

1. Defining rules in Model classes statically
1. Passing rules when calling the `validate()` function

### Defining rules statically

Imagine we have a Post model with this schema:

```js
import { Types, createModel } from 'frint-data';

const Post = createModel({
  schema: {
    title: Types.string,
  },
});
```

We can now optionally add our validation rules as follows:

```js
Post.validationRules = [
  {
    name: 'titleIsNotEmpty', // this can come handy later for grouping errors
    message: 'Title must not be empty',
    rule: function (model) {
      // `model` is your Post model's instance
      if (post.title.length === 0) {
        // we will fail this validation check
        return false;
      }

      // everything is fine
      return true;
    }
  }
];
```

### Validating the model

To get the output of validation errors:

```js
import { validate } from 'frint-data-validation';

const post = new Post({ title: '' });
const validationErrors = validate(post);
```

Since our `title` is empty here, the `validationErrors` will return this array:

```js
console.log(validationErrors);
// [
//   {
//     name: 'titleIsNotEmpty',
//     message: 'Title must not be empty'
//   }
// ]
```

If there were no errors, `validationErrors` would be an empty array.

### Passing validation rules manually

You can also choose not to define the validation rules statically, and pass them when calling `validate()` function:

```js
import { validate } from 'frint-data-validation';

const post = new Post({ title: '' });
const validationErrors = validate(post, {
  rules: [
    {
      name: 'titleIsNotEmpty',
      message: 'Title must not be empty',
      rule: model => model.title.length > 0,
    },
  ],
});
```

### Observing validation errors

If you want to keep observing the model for new errors as it keeps changing:

```js
import { validate$ } from 'frint-data-validation';

const validationErrors$ = validate$(post);
```

Now the `validationErrors$` observable can be subscribed, and it will emit an array with this structure:

```js
[
  {
    name: string,
    message: string,
  }
]
```

---

# API

## validate

> validate(model, options)

### Arguments

1. `model` (`Model`): Model instance from `frint-data`
1. `options` (`Object`)
1. `options.rules` (`Array`): Validation rules

### Returns

`Array` of validation errors.

## validate$

> validate$(model, options)

Reactive version of `validate` function.

### Returns

`Observable` of validation errors.
