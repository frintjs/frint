# frint-component-utils

[![npm](https://img.shields.io/npm/v/frint-component-utils.svg)](https://www.npmjs.com/package/frint-component-utils)

> Component utils package of Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Handlers](#handlers)
- [API](#api)
  - [DefaultHandler](#defaulthandler)
  - [composeHandlers](#composehandlers)
  - [streamProps](#streamprops)

<!-- /MarkdownTOC -->

---

# Guide

This package is aimed at enabling other reactive rendering/templating libraries integrate with FrintJS, and not to be used directly by developers in their applications.

For example, take a look at `frint-react` for its implementation using this package internally.

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-component-utils
```

## Handlers

Handlers concept follows a spec for the lifecycle of a reactive component, without tying itself to any specific library (like React or Vue). They are basically just objects with functions, which will be exposed as methods when composed together into a single instance.

This enables other libraries to integrate with FrintJS as easily as possible. The monorepo here will always provide the handlers logic for maintaining the same behaviour, while others can start implementing these handlers with their preferred rendering library (Vue or Preact for example).

Within the monorepo, we will be consuming these handlers ourselves too to create React-specific packages.

### Handler spec

This is the default handler interface which other handlers are expected to implement as needed:

```js
{
  // options
  app: null,
  component: null,

  // lifecycle: creation
  initialize() {},
  beforeDestroy() {},

  // data
  getInitialData() {},
  setData(key, value) {},
  setDataWithCallback(key, value, cb) {},
  getData(key) {},

  // props
  getProp(key) {},
  getProps() {},

  // lifecycle: mounting
  beforeMount() {},
  afterMount() {},

  // lifecycle: re-rendering
  beforeUpdate() {},
  shouldUpdate(nextProps, nextData) {},
  afterUpdate() {},

  // other
  getMountableComponent(app) {}
}
```

### Handler implementation

For example, [`frint-react`](../frint-react) has an implementation of the handler targeting React. And it was done as follows:

```js
{
  setData(key, value) {
    this.component.setState({
      [key]: value,
    });
  },
  setDataWithCallback(key, value, cb) {
    this.component.setState({
      [key]: value,
    }, cb);
  },
  getData(key) {
    return this.component.state[key];
  },
  getProps() {
    return this.component.props;
  },
  getProp(key) {
    return this.component.props[key];
  }
}
```

You can also see how multiple handlers are composed together and implemented in `Region` and `observe` Components in [`frint-component-handlers`](../frint-component-handlers) and [`frint-react`](../frint-react) packages.

# API

## DefaultHandler

> DefaultHandler

The interface of a default handler object, that other handlers are expected to override.

## composeHandlers

> composeHandlers(...handlers)

### Arguments

1. `handler` (`Object`): with functions to override from default/previous handlers.

### Returns

`Handler`: Instance of handler after composing with all handlers.

## streamProps

> streamProps(defaultProps = {})

Helper function, for composing your props inside `observe`, and then generating and returning an single `Observable`.

### Arguments

1. `defaultProps` (`Object` [optional]): Default props to start with.

### Returns

`Streamer` instance that implements these methods below:

All `set*` methods return the same `Streamer` instance so multiple set calls can be chained in one go.

#### set

> set(key, value)

> set(plainObject)

> set(observable$, ...mapperFunctions)

#### setKey

> setKey('key', 'value')

#### setPlainObject

> setPlainObject({ key: 'value' })

#### setObservable

> setObservable(observable$, ...mapperFunctions)

You can set as many mapper functions until you reach a value of your needs.

```js
setObservable(
  observable$,
  props => props, // no modification
  propsAgain => modifiedProps // with modification
)
```

#### setDispatch

> setDispatch(actionCreators, store)

```js
setDispatch({
  incrementCounter: incrementCounter,
  decrementCounter: decrementCounter,
}, store)
```

#### get$

> get$()

Returns an `Observable`.
