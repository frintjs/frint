# frint-store

[![npm](https://img.shields.io/npm/v/frint-store.svg)](https://www.npmjs.com/package/frint-store)

> Store package of Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Terminologies](#terminologies)
  - [Usage](#usage)
  - [Async actions](#async-actions)
  - [Epics](#epics)
  - [Extra arguments](#extra-arguments)
  - [Note](#note)
- [API](#api)
  - [createStore](#createstore)
  - [combineReducers](#combinereducers)
  - [combineEpics](#combineepics)
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
* `Epic`: Function that accepts and returns an Observable of Actions.

## Usage

Let's import the necessary functions from the library first:

```js
const FrintStore = require('frint-store');
const { createStore, combineReducers } = FrintStore;
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

## Epics

Epic is a concept borrowed from [`redux-observable`](https://redux-observable.js.org/docs/basics/Epics.html).

It is a function that accepts an Observable of actions, and returns an Observable of actions which are then dispatched to the Store.

An example can be this:

```js
function myEpic(action$, store) {
  return action$;
}
```

But doing just like above would cause an infinite loop, it will keep dispatching the same action over and over again.

### Example with epic

We can use an example of PING/PONG here. Let's first define the constants and reducers:

```js
import { combineReducers } from 'frint-store';

const PING = 'PING';
const PONG = 'PONG';

const INITIAL_STATE = {
  isPinging: false,
};

function pingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PING:
      return {
        isPinging: true,
      };

    case PONG:
      return {
        isPinging: false,
      };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  ping: pingReducer,
});
```

So far we have created a reducer only, with no action creators. We can process them via epic as follows:

```js
import { filter } from 'rxjs/operator/filter';
import { delay } from 'rxjs/operator/delay';
import { map } from 'rxjs/operator/map';

function pingEpic(action$) {
  return action$
    ::filter(action.type === PING) // we only want PING actions here
    ::delay(100); // lets wait for 100ms asynchronously
    ::map(() => ({ type: PONG })); // after waiting, dispatch a PONG action
}
```

The syntax above is written using the [bind-operator](https://github.com/tc39/proposal-bind-operator).

Now just like our root reducer, we can create a root epic by combining them all:

```js
import { combineEpics } from 'frint-store';

const rootEpic = combineEpics(pingEpic, someOtherEpic, ...andMoreEpics);
```

We have everything ready to create our Store now:

```js
import { createStore } from 'frint-store';

const Store = createStore({
  reducer: rootReducer,
  epic: rootEpic,
});

const store = new Store();
```

Now dispatching a `PING` would trigger our pingEpic which would wait for 100ms before dispatching a PONG:

```js
store.dispatch({ type: PING });
```

The state would stream like this over time:

```js
store.getState$().subscribe(state => console.log(state));

// initial:      { ping: { isLoading: false } }
// PING:         { ping: { isLoading: true } }
//
// ...wait 100ms
//
// PONG:         { ping: { isLoading: false } }
```

Epics allow you to take full advantage of RxJS, and it makes it easier to handle complex operations like cancellation of asynchronous side effects for example.

## Extra arguments

You can use the `deps` option when defining your Store:

```js
const Store = createStore({
  reducer: rootReducer,
  epic: rootEpic,
  deps: { foo: 'some value' }
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

And also, in your Epics you can access them as:

```js
function myEpic(action$, store, { foo }) {
  return action$;
}
```

## Note

This package is a close implementation of the APIs introduced by the awesome `redux` and `redux-observable`.

---

# API

## createStore

> createStore(options)

### Arguments

1. `options` (`Object`)
    * `options.reducer` (`Function`): The reducer function, that returns updated state.
    * `options.epic` (`Function`): Function receiving and returning an Observable of Actions.
    * `options.initialState` (`Any`): Default state to start with, defaults to `null`.
    * `options.console`: Override global console with something custom for logging.
    * `options.appendAction` (`Object`): Append extra values to Action payload.
    * `options.thunkArgument` (`Any`): Deprecated, use `deps` instead.
    * `options.deps` (`Any`): Extra argument to pass to async actions.
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

## combineEpics

> combineEpics(...epics)

### Arguments

Spread multiple epics as arguments.

```js
combineEpics(counterEpic, listEpic);
```

### Returns

`Function`: The root epic function.

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
function (dispatch, getState, deps) {
  dispatch(actionPayload);
}
```

#### Returns

`void`.
