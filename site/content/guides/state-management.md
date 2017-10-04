---
title: State Management
sidebarPartial: guidesSidebar
---

# State Management

<!-- MarkdownTOC depth=2 autolink=true bracket=round -->

- [`frint-store`](#frint-store)
- [Store vs State](#store-vs-state)
- [Create your App with Store](#create-your-app-with-store)
  - [Dependencies](#dependencies)
  - [Constants](#constants)
  - [Action creators](#action-creators)
  - [Reducer](#reducer)
  - [Root reducer](#root-reducer)
  - [App](#app)
  - [Async actions](#async-actions)
  - [Component](#component)
  - [Streaming props](#streaming-props)
  - [Render](#render)

<!-- /MarkdownTOC -->

## `frint-store`

Frint ships with a `frint-store` package, which enables you to create reducer based stores, and subscribe to state changes using an Observable.

The concepts are all borrowed from [Redux](https://redux.js.org). And `frint-store` happens to be a more minimal implementation of that supporting observables, for nicely integrating with the rest of the framework.

You can find more documentation about the `frint-store` package [here](/docs/packages/frint-store).

## Store vs State

Store is the main object that holds everything related to state for you. You can dispatch something to it for making changes, while subscribing to state too.

State happens to be the actual object that represents the current state of your Store, and it can keep streaming as changes are made to it.

## Create your App with Store

Let's say we want to build an App, that has a plus and minus button for increasing and decreasing a counter value.

### Dependencies

First install the packages:

```
$ npm install --save frint frint-react frint-store
```

### Constants

Define constants for action types, that we will reuse in Actions and Reducers:

```js
// constants/index.js
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
```

### Action creators

```js
// actions/counter.js
function incrementCounter() {
  return { type: INCREMENT_COUNTER };
}

function decrementCounter() {
  return { type: DECREMENT_COUNTER };
}
```

### Reducer

Our reducer for counter:

```js
// reducers/counter.js
import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER
} from '../constants';

const INITIAL_STATE = {
  value: 0
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return Object.assign({}, {
        value: state.value + 1
      });

    case DECREMENT_COUNTER:
      return Object.assign({}, {
        value: state.value - 1
      });

    default:
      return state;
  }
}
```

### Root reducer

As your state grows over time, you will end up having lots of code in your reducer. That's why it is recommended that you split your responsibilities across multiple reducers, and then combine them all into a single root reducer that can be passed to your Store:

```js
// reducers/index.js
import { combineReducers } from 'frint-store';

import counterReducer from './counter';

export default combineReducers({
  counter: counterReducer
});
```

### App

This is where we would define our Store and pass it to our App as a provider:

```js
// app/index.js
import { createApp } from 'frint';
import { createStore } from 'frint-store';

import rootReducer from '../reducer';

export default createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'store',
      useFactory: function () {
        const Store = createStore({
          reducer: rootReducer
        });

        return new Store();
      }
    }
  ]
});
```

### Async actions

What if you would like to support [async actions](/docs/packages/frint-store/#async-actions) in your App?

We can achieve that by changing our provider a bit:

```js
export default createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'store',
      useFactory: function ({ app }) { // the `app` instance via `deps`
        const Store = createStore({
          reducer: rootReducer,
          deps: { app }
        });

        return new Store();
      },
      deps: ['app'] // gives you the `app` instance in `useFactory`
    }
  ]
});
```

Doing this now allows our Action Creators to asynchronously dispatch further actions:

```js
// actions/counter.js
export function incrementCounterAsync() {
  // instead of returning an object, we return a function
  return function (dispatch, getState, { app }) {
    // `dispatch(actionPayload)` can dispatch another action
    // `getState()` returns the current state object
    // `app` is available because of `deps`

    setTimeout(function () {
      dispatch(incrementCounter()); // increment after 2 seconds
    }, 2000);
  }
}
```

### Component

Now that we have the store ready, it's time to write our Component:

```js
// components/Root.js
import React, { Component } from 'react';
import { Observable } from 'rxjs';
import { observe } from 'frint-react';

// our action creators
import { incrementCounter, decrementCounter } from '../actions/counter';

// React component
class Root extends Component {
  render() {
    return (
      <div>
        <p>Counter value: {this.props.counter}</p>

        <button onClick={() => this.props.increment()}>+</button>
        <button onClick={() => this.props.decrement()}>-</button>
      </div>
    );
  }
}

// make our Component reactive
export default observe(function (app) {
  const store = app.get('store'); // the Store instance
  const state$ = store.getState$(); // state as an observable

  // Observable that maps state to props
  const stateProps$ = state$.map(function (state) {
    return {
      counter: state.counter.value
    };
  });

  // Observable for our dispatchable action creators as props
  const actionProps$ = Observable.of({
    increment: (...args) => store.dispatch(incrementCounter(...args)),
    decrement: (...args) => store.dispatch(decrementCounter(...args)),
  });

  // merge the two Observables into one, and return
  return stateProps$
    .merge(actionProps$)
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    });
})(Root);
```

The last thing we need to do is to assign this component to our App as a provider:

```js
// app/index.js
import { createApp } from 'frint';
import { createStore } from 'frint-store';

export default createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'component',
      useValue: Root
    },
    {
      name: 'store',
      // useFactory: ...
      // deps: ...
    }
  ]
});
```

### Streaming props

What we did in the example above for Component, was to create a single Observable that keeps emitting props, and then passed to the Root component when rendered.

Your components can become complex over time, and may need to handle multiple observables together.

We ship a handy `streamProps` function in `frint-react` package, to make your code shorter. The same component above can be written this way:

```js
import React, { Component } from 'react';
import { observe, streamProps } from 'frint-react';

import { incrementCounter, decrementCounter } from '../actions/counter';

class Root extends Component {
  render() {
    // ...
  }
}

export default observe(function (app) {
  return streamProps()
    // state
    .set(
      app.get('store').getState$(),
      state => ({ counter: state.counter.value })
    )

    // dispatchable actions
    .setDispatch({
      incrementCounter,
      decrementCounter
    }, app.get('store'))

    // generate and return final observable
    .get$();
});
```

You can read more about `streamProps` in the API documentation [here](/docs/packages/frint-react/#streamprops).

### Render

Now just render your App, and you can see it live in your browser:

```js
// index.js
import { render } from 'frint-react';

import App from './app';

window.app = new App();
render(window.app, document.getElementById('root'));
```
