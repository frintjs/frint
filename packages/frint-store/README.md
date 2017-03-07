# frint-store

[![npm](https://img.shields.io/npm/v/frint-store.svg)](https://www.npmjs.com/package/frint-store)

> Store plugin of Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Terminologies](#terminologies)
  - [Usage](#usage)
  - [Async actions](#async-actions)
  - [Extra arguments](#extra-arguments)
- [API](#api)
  - [createStore](#createstore)
  - [combineReducers](#combinereducers)
  - [store](#store)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-store
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.0.1/Rx.min.js"></script>

<script src="https://unpkg.com/frint-store@latest/dist/frint-store.min.js"></script>

<script>
  // available as `window.FrintStore`
</script>
```

## Terminologies

* `Store`: The object that holds state, with additional methods.
* `State`: Plain object that holds the state.
* `Action`: A plain object/payload telling Store to do something.
* `Action Type`: All action payloads are required to have a `type` key.
* `Action Creator`: A function that returns the Action payload.
* `Reducer`: Function that returns a new updated state based on Action.

## Usage

Let's import the necessary functions from the library first:

```js
const Frint = require('frint');
const { createStore, combineReducers } = Frint;
```

We can start by defining our Action Types:

```js
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
```

Then we can proceed with writing our Action Creator functions:

```js
function incrementCounter() {
  return {
    type: INCREMENT_COUNTER
  };
}

function decrementCounter() {
  return {
    type: DECREMENT_COUNTER
  };
}
```

Let's follow up with a Reducer now:

```js
const INITIAL_COUNTER_STATE = {
  value: 0
};

function counterReducer(state = INITIAL_COUNTER_STATE, action) {
  switch (action.type) {
    case 'INCREMENT_COUNTER':
      return Object.assign({}, {
        value: state.value + 1
      });
    case 'DECREMENT_COUNTER':
      return Object.assign({}, {
        value: state.value - 1
      });
    default:
      return state;
  }
}
```

Over time, it is likely the number of reducers that you have would increase. In that case, you can combine them via `combineReducers` function:

```js
const rootReducer = combineReducers({
  counter: counterReducer
});
```

Now we can create our Store class:

```js
const Store = createStore({
  reducer: rootReducer
});

const store = new Store();
const state$ = store.getState$();

// every time state changes, it will log the latest output
state$.subscribe((state) => console.log(state));
```

You can now dispatch actions via:

```js
store.dispatch(incrementCounter());
// would print latest state in console:
// `{ counter: { value: 1 } }`
```

## Async actions

Not all actions may trigger a synchronous change in state. For those, you can return a function from your action creator.

```js
function incrementCounterAsync() {
  // instead of returning an object, we return a function
  return function (dispatch, getState) {
    // `dispatch` is a function you can call with you action payload
    // `getState` would give you the most recent state in a synchronous way

    setTimeout(function () {
      dispatch(incrementCounter());
    }, 3000); // update state after 3 seconds
  };
}
```

## Extra arguments

You can use the `thunkArgument` option when defining your Store:

```js
const Store = createStore({
  reducer: rootReducer,
  thunkArgument: { foo: 'some value' }
});
```

Now in your async actions, you can access `foo` as:

```js
function incrementCounterAsync() {
  return function (dispatch, getState, { foo }) {
    // `foo` is `some value` here
    dispatch(incrementCounter());
  };
}
```

---

# API

## createStore

> createStore(options)

### Arguments

1. `options` (`Object`)
    * `options.reducer` (`Function`): The reducer function, that returns updated state.
    * `options.initialState` (`Any`): Default state to start with, defaults to `null`.
    * `options.console`: Override global console with something custom for logging.
    * `options.appendAction` (`Object`): Append extra values to Action payload.
    * `options.thunkArgument` (`Any`): Extra argument to pass to async actions.
    * `options.enableLogger` (`Boolean`): Enable/disable logging in development mode.

### Returns

`Store` class.

## combineReducers

> combineReducers(reducers)

### Arguments

1. `reducers` (`Object`): Reducer functions keyed by their names

```js
combineReducers({
  counter: counterReducer,
  list: listReducer,
});
```

### Returns

`Function`: The root reducer function.


## store

> new Store()

The Store instance.

### getState

> getState()

#### Returns

`Object`: The most recent state, in a synchronous way.

### getState$

> getState$()

#### Returns

`Observable`: The state as an observable.

### dispatch

> dispatch(action)

Dispatches the action, which will later trigger changes in state.

#### Arguments

1. `action` (`Object`|`Function`): A plain object, with at least a `type` key.

The `action` argument can also be a function:

```js
function (dispatch, getState, thunkArgument) {
  dispatch(actionPayload);
}
```

#### Returns

`void`.
