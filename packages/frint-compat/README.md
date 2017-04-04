# frint-compat

[![npm](https://img.shields.io/npm/v/frint-compat.svg)](https://www.npmjs.com/package/frint-compat)

> Backwards compatibility package for Frint

Everything that you see here has been deprecated and should not be intentionally used.

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)
  - [createComponent](#createcomponent)
  - [h](#h)
  - [PropTypes](#proptypes)
  - [createService](#createservice)
  - [createFactory](#createfactory)
  - [createApp](#createapp)
  - [app](#app)
  - [mapToProps](#maptoprops)
  - [Store](#store)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-compat
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.0.1/Rx.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.8/react.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.8/react-dom.min.js"></script>

<script src="https://unpkg.com/frint@latest/dist/frint.min.js"></script>
<script src="https://unpkg.com/frint-model@latest/dist/frint-model.min.js"></script>
<script src="https://unpkg.com/frint-react@latest/dist/frint-react.min.js"></script>
<script src="https://unpkg.com/frint-store@latest/dist/frint-store.min.js"></script>

<script src="https://unpkg.com/frint-compat@latest/dist/frint-compat.min.js"></script>
<script>
  // available as `window.Frint` (now backwards compatible)
</script>
```

## Usage

Load it after you have loaded all other packages:

```js
require('frint-compat');
```

Doing so would mutate other packages to keep them backwards compatible.

# API

## createComponent

> createComponent(options)

Creates a new Component, using React internally.

### Arguments

1. `options` (`Object`):
    * `render` (`Function` [required]): Function returning JSX.
    * `beforeMount` (`Function`): Called before mounting the Component.
    * `afterMount` (`Function`): Called after mounting the Component.
    * `beforeUnmount` (`Function`): Called right before unmounting the Component.

### Returns

`Component`: React Component.

## h

> h(type, props, children)

The hyperscript wrapping React's [`React.createElement`](https://facebook.github.io/react/docs/react-api.html#createelement). This function is expected to be in the scope wherever JSX is used.

## PropTypes

> PropTypes

For [typechecking](https://facebook.github.io/react/docs/typechecking-with-proptypes.html) Component's props.

## createService

> createService(options)

### Arguments

1. `options` (`Object`): Methods for your class.
    * `options.initialize` (`Function`): Treated as class constructor.

### Returns

`Function`: ES6-compatible class.

## createFactory

> createFactory(options)

### Arguments

1. `options` (`Object`): Methods for your class.
    * `options.initialize` (`Function`): Treated as class constructor.

### Returns

`Function`: ES6-compatible class.

## createApp

> createApp(options)

### Arguments

1. `options` (`Object`):
    * `options.component` (`Function`): The root Component of your App.
    * `options.services` (`Object`): Key/value pairs of Service classes.
    * `options.factories` (`Object`): Key/value pairs of Factory classes.
    * `options.models` (`Object`): Key/value pairs of Model classes.
    * `options.modelAttributes` (`Object`): Key/value pairs of Model attributes.
    * `options.store` (`Object`): The Store instance.
    * `options.reducer` (`Function`): Root reducer for your Store.
    * `options.initialState` (`Object`): Initial state for your Store.
    * `beforeMount` (`Function`): Called before mounting the App.
    * `afterMount` (`Function`): Called after mounting the App.
    * `beforeUnmount` (`Function`): Called right before unmounting the App.

### Returns

`App`: App class.

## app

> new App()

App instance methods:

### app.getRootApp

> app.getRootApp()

Extends the native `getRootApp()`, and looks for `window.app` first, and then returns it if exists.

#### Returns

`App`: The root app's instance.

### app.getState$

> app.getState$()

#### Returns

`Observable`: State of your App's store.

### app.dispatch

> app.dispatch(action)

#### Arguments

1. `action` (`Object`|`Function`): Action payload to dispatch to your App's store.

#### Returns

`void`

### app.render

> app.render()

#### Returns

`Function`: The root component.

### app.getStore

> app.getStore()

#### Returns

`Store`: The app's store instance.

### app.getService

> app.getService(name)

#### Arguments

1. `name` (`String`): The name of the Service.

#### Returns

`Object`: The service instance.

### app.getFactory

> app.getFactory(name)

#### Arguments

1. `name` (`String`): The name of the Factory.

#### Returns

`Object`: The factory instance.

### app.getModel

> app.getModel(name)

#### Arguments

1. `name` (`String`): The name of the Model.

#### Returns

`Object`: The model instance.

### app.setRegion

> app.setRegion(name)

#### Arguments

1. `name` (`String`): The name of the region.

#### Returns

`void`.

### app.setRegions

> app.setRegions(names)

#### Arguments

1. `names` (`Array`): Array of region names.

#### Returns

`void`.

### app.getWidgets

> app.getWidgets(regionName = null)

#### Arguments

1. `regionName` (`String` [optional]): Optionally filter apps by their region.

#### Returns

`Array`: of app instances.

### app.readStateFrom

> app.readStateFrom(names)

#### Arguments

1. `names` (`Array`): Array of other App names that you wish to read state from.

#### Returns

`void`.

## mapToProps

> mapToProps(options)(Component)

Maps data coming from various sources into Component's props.

### Arguments

1. `options` (`Object`):
    * `options.state` (`Function`): Accepts `state` (`Object`) as argument, and returns object to map as props.
    * `options.dispatch` (`Object`): Dispatchable action creators, keyed by prop names
    * `app` (`Function`): Accepts `app` (`App`) as argument, and returns object to map as props.
    * `shared` (`Function`): Accepts `shared` (`Object`) state as argument, and returns object to map as props.
    * `services` (`Object`): Object keyed by prop names, and service names as values.
    * `factories` (`Object`): Object keyed by prop names, and factory names as values.
    * `models` (`Object`): Object keyed by prop names, and model names as values.
    * `observe` (`Function`): Accepts `app` (`App`) as an argument, and returns an `Observable` emitting object to be mapped as props.

### Returns

`Function`: That can be alled with the target Component.

## Store

> new Store()

### store.subscribe

> store.subscribe(fn)

#### Arguments

1. `fn` (`Function`): Listener function, that accepts the latest state as argument.

#### Returns

`Function`: Call the returned function to unsubscribe from the listener.
