# Actions

Actions are basically payloads (messages), that are passed down to Reducers, which takes care of updating the state accordingly.

An action object must always contain the `type` key, and can contain additional properties too.

An example:

```js
{
  type: 'ADD_TODO',
  title: 'My task name here...'
}
```

## Action creators

Action creators are just pure functions, that return the action payload, which can be passed to Reducers. An example can be:

```js
// actions/todos.js

export function addTodo(title) {
  return {
    type: 'ADD_TODO',
    title: title
  };
}
```

## Action Types as Constants

It is good practice to keep your Action types as constants separately, since you will be using them in multiple places when Reducers come into play.

```js
// constants/ActionTypes.js

export const ADD_TODO = 'ADD_TODO';
```

and then import and use them in Action creators:

```js
// actions/todos.js

import { ADD_TODO } from '../constants/ActionTypes';

export function addTodo(title) {
  return {
    type: ADD_TODO,
    title: title
  };
}
```

## Asynchronous Actions

What if one Action needs to trigger another Action asynchronously? Think of a scenario where AJAX requests are involved:

* `fetchTodos()` is called
* it marks `loading` to true in reducer by calling `markAsLoading()` action
* data gets loaded, and we set them by calling `populateTodos(todos)`
* afterwards, we set `loading` to false by calling `markAsLoaded()`

We can achieve this by returning functions from Action creators:

```js
// actions/todos.js

import {
  MARK_AS_LOADING,
  MARK_AS_LOADED,
  POPULATE_TODOS
} from '../constants/ActionTypes';

export function markAsLoading() {
  return {
    type: MARK_AS_LOADING
  };
}

export function markAsLoaded() {
  return {
    type: MARK_AS_LOADED
  };
}

export function populateTodos(todos) {
  return {
    type: POPULATE_TODOS,
    todos: todos
  };
}

// this is where you combine them all together
export function fetchTodos() {
  return (dispatch) => {
    dispatch(markAsLoading());

    somePromiseForFetchingTodosFromServer()
      .then((todos) => {
        dispatch(populateTodos(todos))
      })
      .then(() => {
        dispatch(markAsLoaded());
      });
  };
}
```
