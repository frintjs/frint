# mapToProps

This is a handy function that is used for enhancing your Components, by injecting new values as props coming in from various sources.

## State

If you want to get values from state, and bind the values as they change to your Component as props, you can:

```js
import { createComponent, mapToProps } from 'frint';

const MyComponent = createComponent({
  render() {
    const { todos } = this.props;

    return (...); // JSX here
  }
});

export default mapToProps({
  state: (state) => {
    todos: state.todos.records
  }
})(MyComponent);
```

## Actions

```js
import { createComponent, mapToProps } from 'frint';

import { addTodo } from '../actions/todos';

const MyComponent = createComponent({
  render() {
    const { handleAddButton } = this.props;

    return (...); // JSX here
  }
});

export default mapToProps({
  dispatch: {
    handleAddButton: addTodo
  }
})(MyComponent);
```

Alternatively, you can map it like this:

```js
export default mapToProps({
  dispatch: (dispatch) => {
    return {
      handleAddButton: (...args) => addTodo(...args)
    };
  }
})(MyComponent);
```

Or, if you want to be more strict about the arguments being passed down to the Action:

```js
export default mapToProps({
  dispatch: (dispatch) => {
    return {
      handleAddButton: (title) => addTodo(title)
    };
  }
})(MyComponent);
```

## App

If you want to inject something coming from the App instance:

```js
export default mapToProps({
  app: (app) => {
    return {
      appName: app.getOption('name')
    };
  }
})(MyComponent);
```

Models can be accessed as:

```js
export default mapToProps({
  app: (app) => {
    return {
      color: app
        .getModel('shirt')
        .getColor()
    };
  }
})(MyComponent);
```

## Shared state from other Apps

If you app is alloed to listen to state changes happening in other Apps, you can:

```js
export default mapToProps({
  shared: (sharedState) => {
    return {
      counter: sharedState.SomeOtherAppName[reducerName].someKey
    };
  }
})(MyComponent);
```

## Services

```js
export default mapToProps({
  services: {
    // propName: serviceKeyName
    http: 'http'
  }
})(MyComponent);
```

## Factories

```js
export default mapToProps({
  factories: {
    // propName: factoryKeyName
    request: 'request'
  }
})(MyComponent);
```
