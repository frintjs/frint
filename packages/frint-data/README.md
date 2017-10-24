# frint-data

[![npm](https://img.shields.io/npm/v/frint-data.svg)](https://www.npmjs.com/package/frint-data)

> Reactive data modelling package for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Terminologies](#terminologies)
  - [Usage](#usage)
  - [Types](#types)
  - [Models](#models)
  - [Collections](#collections)
  - [Embedding](#embedding)
  - [Note](#note)
- [API](#api)
  - [Types](#types-1)
  - [createModel](#createmodel)
  - [createCollection](#createcollection)
  - [Model](#model)
  - [Collection](#collection)
  - [reduce](#reduce)
  - [isModel](#ismodel)
  - [isCollection](#iscollection)
  - [TypesError](#typeserror)
  - [MethodError](#methoderror)
  - [CollectionError](#collectionerror)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-data
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.5.0/Rx.min.js"></script>

<script src="https://unpkg.com/frint-data@latest/dist/frint-data.min.js"></script>

<script>
  // available as `window.FrintData`
</script>
```

## Terminologies

* `Model`: Object-like data structures
* `Collection`: Array-like data structures
* `Schema`: The structure of a Model
* `Type`: Type of individual keys in a Model's Schema

## Usage

Let's first import the dependencies:

```js
import { Types, createModel, createCollection } from 'frint-data';
```

### Define Model

```js
// Individual Todo items can be Models
const Todo = createModel({
  // schema
  schema: {
    title: Types.string, // or, Types.string.isRequired
    completed: Types.bool, // or, Types.bool.defaults(false)
  },

  // custom methods
  setTitle(newTitle) {
    this.title = newTitle;
  },
});
```

### Define a Collection

```js
// a group of Todo models can be put in a Todos collection
const Todos = createCollection({
  model: Todo,
});
```

### Intantiate classes

```js
// model
const todo = new Todo({
  title: 'First task',
  completed: false,
});

// collection
const todos = new Todos();
todos.push(todo);
```

### Model usage

```js
// access properties
console.log(todo.title); // `First task`

// properties are immutable
todo.title = 'First task title changed';
console.log(todo.title); // still `First task`

// mutate them via methods only
todo.setTitle('First task [updated]');
console.log(todo.title); // `First task [updated]`
```

### Collection usage

```js
// lets push the model to collection
todos.push(todo);
console.log(todos.length); // `1`

todos.push(new Todo({
  title: 'My second task',
  completed: false
}));
console.log(todos.length); // `2`

// let's take the last model out of the collection
const lastTodo = todos.pop();
console.log(lastTodo); // `My second task`
```

### Observing Models and Collections

```js
import { map } from 'rxjs/operators/map';

// model
const todoTitle$ = todo.get$()
  .pipe(
    map(model => model.title)
  );

todoTitle$.subscribe(function (title) {
  console.log(title); // will stream as the Model changes
});

// collection
todos.get$().subscribe(function (collection) {
  console.log('collection was changed');
});
```

## Types

One of the main features of `frint-data` is that it is strictly based on typed values.

A list of type expressions are already shipped with the package and you can import them as follows:

```js
import { Types } from 'frint-data';
```

Some of the types include:

* `Types.string`
* `Types.number`
* `Types.enum`
* ...see API Reference below for more.

### Primary types

If you want to check the type of a value that you expect to be a string:

```js
const checkIfString = Types.string;
```

Now the `checkIfString` function would return a string if a correct valid string was passed to it, otherwise it would throw a new `TypesError`.

```js
const str = checkIfString('Hello World'); // returns `Hello World`

const foo = checkIfString([1, 2, 3]); // throws TypesError
```

### Chaining types

Type expressions can also be chained:

```js
const checkIfString = Types.string.isRequired;

checkIfString('hello world'); // returns `hello world`

checkIfString(); // throws TypesError: value is undefined
```

Available chained expressions:

* `isRequired`
* `defaults(defaultValue)`

## Models

Models are objects that **represent** data. A model can hold data in the form of regular strings, booleans, and even embed other Models and Collections.

### Create a Model class

When creating a Model class, we need to pass a schema (formed of `Types`):

```js
import { Types, createModel } from 'frint-data';

const Todo = createModel({
  schema: {
    title: Types.string.isRequired,
    completed: Types.bool.defaults(false),
  },
});
```

Here, we are creating a new Model class for Todo, and we are providing a schema to it saying `title` is a required string, and `completed` is a boolean value that defaults to `false`.

### Create a model instance

```js
const todo = new Todo({
  title: 'My new todo item'
});
```

Since `completed` would default to false, we don't need to pass it during instantiation. But if we didn't provide the `title`, it would throw a new `TypesError`.

### Accessing model properties

You can get the values from your model instance just like you would do with a regular plain object:

```js
const title = todo.title; // `My new todo item`
```

### Immutable by default

Model properties are immutable by default. And you can only change them via methods that you define while creating the Model class in the beginning.

```js
todo.title = 'Changing the title'; // has no impact

console.log(todo.title); // still `My new todo item`
```

### Model methods

To change any property values, lets extend your Model class a bit more, by passing a new method in `createModel()`:

```js
const Todo = createModel({
  schema: {
    title: Types.string.isRequired,
    completed: Types.bool.defaults(false),
  },

  // custom method
  setTitle(newTitle) {
    this.title = newTitle;
  },
});
```

Now from instance level, we can change the title:

```js
todo.setTitle('Changing the title');

console.log(todo.title); // `Changing the title`
```

## Collections

Collections are **arrays** of Models, and to be more precise, they contain Models of a specific single class.

For example a `Todos` collection consisting of only `Todo` models.

### Create a Collection class

```js
import { createCollection } from 'frint-data';

const Todos = createCollection({
  model: Todo, // passing the Todo model class
});
```

### Create a collection instance

```js
// empty instance
const todos = new Todos();

// instance with some models data
const todos = new Todos([
  { title: 'First task' }, // will be converted to Todo instances
  { title: 'Second task'}
]);

// instance with some model instances
const todos = new Todos([
  new Todo({ title: 'First task' }),
  new Todo({ title: 'Second task' })
]);
```

### Methods

You can make new methods available to your collection instances as follows:

```js
const Todos = createCollection({
  model: Todo,

  // custom method
  doSomething() {
    return true;
  },
});
```

Collection instances also come with built-in methods like `map`, `filter`, `reduce` just like `Array`. See more in API Reference.

## Embedding

Models can embed other Models and Collections, and this can go as many levels deep as the data structure demands.

### Embedding Models

Let's say we have an individual `Address` model:

```js
import { Types, createModel } from 'frint-data';

const Address = createModel({
  schema: {
    street: Types.string.isRequired,
    city: Types.string.isRequired,
  },
  setStreet(street) {
    this.street = street;
  },
});
```

And we also have a `Person` model:

```js
const Person = createModel({
  schema: {
    name: Types.string.isRequired,
  },
});
```

If we wish to embed `Address` model in a new schema key `address` in `Person` model, we can do:

```js
const Person = createModel({
  schema: {
    name: Types.string.isRequired,
    address: Types.model.of(Address).isRequired,
  },
});
```

Next, if we instantiate a new `Person`:

```js
const person = new Person({
  name: 'Sirius Black',
  address: {
    street: '12 Grimmauld Place',
    city: 'London'
  }
});

// `person` is an instance of Person
// `person.address` is an instance of Address
```

To change the street name of the address, we would access the method as:

```js
person.address.setStreet('New street name');
```

### Embedding Collections

From previous examples, we already have a `Person` model. Now let's say, a `Person` has a collection of `Books`.

We can define the classes as follows:

```js
import { Types, createModel, createCollection } from 'frint-data';

const Book = createModel({
  schema: {
    title: Types.string.isRequired,
  },
});

const Books = createCollection({
  model: Book,
});

const Person = createModel({
  schema: {
    name: Types.string.isRequired,
    books: Types.collection.of(Books),
  },
});
```

When instantiating a `Person`, we can optionally pass books data too:

```js
const person = new Person({
  name: 'Bathilda Bagshot',
  books: [
    { title: 'A History of Magic' }
  ]
});

// `person` is an instance of Person
// `person.books` is an instance of Books
// `person.books.at(0)` is an instance of Book
```

You could now add more books to the list as:

```js
person.books.push(new Book({
  name: 'Hogwarts: A History'
}));
```

## Note

The API is highly inspired by [Tydel](https://tydel.js.org), and this package aims to be a reactive version of it using RxJS.

---

# API

## Types

> Types

Type expressions for your Models' schema.

Available types:

### Types.string

> Types.string

```js
const Todo = createModel({
  schema: {
    title: Types.string
  }
});
```

### Types.bool

> Types.bool

```js
const Todo = createModel({
  schema: {
    completed: Types.bool
  }
});
```

### Types.number

> Types.number

```js
const Person = createModel({
  schema: {
    age: Types.number
  }
});
```

### Types.enum

> Types.enum

If you want the value to be one of the pre-defined list of values:

```js
const Book = createModel({
  schema: {
    category: Types.enum([
      'history',
      'fiction',
      'romance'
    ])
  }
});
```

And if you want the enum to be of specific types, you can use enum.of:

```js
const Book = createModel({
  schema: {
      category: Types.enum.of([
      Types.string,
      Types.number
    ])
  }
});
```

### Types.UUID

> Types.uuid

```js
const Book = createModel({
  schema: {
    id: Types.uuid
  }
});
```

Example UUID value: 27961a0e-f4e8-4eb3-bf95-c5203e1d87b9

### Types.model

> Types.model

Models can embed other models too:

```js
const Person = createModel({
  schema: {
    address: Types.model
  }
});
```

If you want to be more strict about which Model class can be embedded, use `model.of`:

```js
const Address = createModel({
  schema: {
    street: Types.string,
    city: Types.string
  }
});

const Person = createModel({
  schema: {
    address: Types.model.of(Address)
  }
});
```

### Types.collection

> Types.collection

Collections can also be embedded in models:

```js
const Author = createModel({
  schema: {
    books: Types.collection
  }
});
```

If you want to be more strict about which Collection class can be embedded, use `collection.of`:


```js
const Book = createModel({
  schema: {
    title: Types.string
  }
});

const Books = createCollection({
  model: Book
});

const Author = createModel({
  schema: {
    books: Types.collection.of(Books)
  }
});
```

The following Types are available, but not recommended for use since these do not support observing them for changes. Consider embedding Models or Collections instead:

* `Types.object`
* `Types.array`
* `Types.any`

## createModel

> createModel(options)

Returns a `Model` class based on the schema and methods that are provided.

### Arguments

1. `options` (`Object`):
  * `options.schema` (`Object`): Schema object with keys having field values based on `Types` expressions
  * `options.initialize` (`Function`): Called when the Model is constructed
  * `options.*` (`Function`): Custom methods

### Returns

Model class.

## createCollection

> createCollection(options)

### Arguments

1. `options` (`Object`):
  * `options.model` (`Model`): Model class that this Collection is of
  * `options.initialize` (`Function`): Called when the Collection is constructed
  * `options.*` (`Function`): Custom methods

### Returns

Collection class.

## Model

Next to the custom methods, Models also expose some built-in methods.

Some methods also support streaming the results with an Observable. Look for methods ending with `$`:

### model.getIn

> getIn(paths)

> getIn$(paths)

Returns the value in given path.

For example:

```js
const firstBookTitle = author.getIn(['books', 0, 'title']);

// same as:
// author.books.at(0).title;
```

### model.get

> get()

> get(path)

> get$(path)

If no argument provided, then results self.

The `path` can either be key according to the model's schema, or a dot separated path targeting some nested child.

```js
person.get('books.0.title');

// same as:
// person.getIn(['books', 0, 'title']);
```

### toJS

> toJS()

> toJS$()

Returns a plain JavaScript object from all its properties, as well as nested Models and Collections.

### model.destroy

> destroy()

Destroys the model, and cleans up its watchers.

## Collection

The Collection instance tries to imitate the native `Array` as much as possible.

Most methods also support supporting streaming the results as they change. Look for methods ending with `$` in examples.

### collection.length

> length

The lengh of the Collection.

```js
const length = collection.length;
```

### collection.at

> collection.at(n)

> collection.at$(n)

Returns the model at specific index

### collection.push

> collection.push(model)

Pushes the model, and adds it to the end of the collection.

### collection.every

> every(iteratorFn)

> every$(iteratorFn)

Tests whether all models in the collection pass the test implemented by the provided function.

### collection.filter

> filter(iteratorFn)

> filter$(iteratorFn)

Creates a new array with all models that pass the test implemented by the provided function.

### collection.find

> find(iteratorFn)

> find$(iteratorFn)

Returns a model in the collection, if a model in the array satisfies the provided testing function. Otherwise undefined is returned.

### collection.forEach

> forEach(iteratorFn)

Executes provided function once per model in the collection.

### collection.includes

> includes(model)

> includes$(model)

Determines whether colelction includes a certain model, returning true or false as appropriate.

### collection.indexOf

> indexOf(model)

> indexOf$(model)

Returns the first index at which a given model can be found in the collection, or -1 if it is not present.

### collection.map

> map(fn)

> map$(fn)

Creates a new array with the results of calling the provided function on every model in this collection.

## reduce

> reduce(fn, initialValue)

> reduce$(fn, initialValue)

Applies the function against an accumulator and each model of the collection (from left-to-right) to reduce it to a single value.

### collection.some

> some(iteratorFn)

> some$(iteratorFn)

Tests whether some model in the collection passes the test implemented by the provided function.

### collection.pop

> pop()

Removes the last model from the collection and returns that model. This method changes the length of the collection.

### collection.shift

> shift()

Removes the first model from the collection and returns that model. This method changes the length of the collection.

### collection.unshift

> unshift(model)

Adds one or more models to the beginning of the collection and returns the new length of the collection.

### collection.remove

> remove(model)

Removes model from the collection.

### collection.removeFrom

> removeFrom(n)

Removes model from the given n index.

### collection.first

> first()

> first$()

Gets the first model of the collection.

### collection.last

> last()

> last$()

Gets the last model of the collection.

### collection.take

> take(n = 1)

> take$(n = 1)

Creates a slice of array with n models taken from the beginning.

### collection.takeRight

> takeRight(n = 1)

> takeRight$(n = 1)

Creates a slice of array with n models taken from the end.

### collection.destroy

> destroy()

Destroys the collection and its watchers.

### collection.toJS

> toJS()

> toJS$()

Converts the collection to a plain array, and also converting the models into plain objects recursively.

### collection.get

> get$()

Returns an Observable of the collection, as it keeps on changing.

## isModel

> isModel(object)

### Arguments

1. `object` (`Object`): The argument to check against

### Returns

`Boolean`: True if the given object is a valid Model instance, false otherwise.

## isCollection

> isCollection(object)

### Arguments

1. `object` (`Object`): The argument to check against

### Returns

`Boolean`: True if the given object is a valid Collection instance, false otherwise.

## TypesError

> TypesError

Thrown when Type checking has failed.

## MethodError

> MethodError

Thrown when executing a custom method has resulted in an error.

## CollectionError

> CollectionError

Thrown when a Collection has experienced an error.
