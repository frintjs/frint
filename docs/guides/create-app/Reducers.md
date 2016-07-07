## Reducers

Reducers are what is responsible for update the state in Store. They are all pure functions, and they receive existing state and the Action (payload), and return updated state.

### Example

An example reducer for todos would be:

```js
// reducers/todos.js

export default function todos(state, action) {
  // update the state here...

  return state;
}
```

A more relevant example from previous documentation for ToDos would be:

```js
// reducers/todos.js

import { ADD_TODO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  records: []
};

export default function tasks(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_TODO:
      const { records } = state;
      const { title } = action; // title of the ToDo

      const newTodo = { title };

      return Object.assign({}, state, {
        records: [
          ...records,
          newTodo
        ]
      });
    default:
      return state;
  }
}
```

### Combining reducers

Apps can have multiple reducers, and you can then combine them into one, and export it. The App class would then use that root reducer when instantiation.

```js
// reducers/index.js

import { combineReducers } from 'frint';

import todos from './todos';
import users from './users';

export default combineReducers({
  todos,
  users
});
```

### Adding your root Reducer to App

In your App class, pass the root reducer as `reducer`:

```js
// app/index.js
import { createApp } from 'frint';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createApp({
  name: 'MyAppName',

  component: Root,

  initialState: {},

  reducer: rootReducer
});
```

And you are done. Next we would talk about how to inject state and action dispatchers in Components.
