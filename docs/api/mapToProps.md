# mapToProps

This is a handy function that is used for enhancing your Components, by injecting new values as props coming in from various sources.

## State

If you want to get values from state, and bind the values as they change to your Component as props, you can:

```js
/** @jsx h */
import { createComponent, mapToProps, h } from 'frint';

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
/** @jsx h */
import { createComponent, mapToProps, h } from 'frint';

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

If you app is allwoed to listen to state changes happening in other Apps, you can:

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

## Observe

The `observe` key can be used for listening to an observable, and then map its returned object as props.

You have access to the `app` instance, leaving you free to get observables from other Factories or Services if need be

```js
import { Observable } from 'rxjs';

export default mapToProps({
  observe: (app) => {
    return Observable
      // iterate over these values in a sequence
      .of(1, 2)

      // now convert it to an object, which will be available as props
      .scan(
        // this function would be called twice,
        // first with `1`, and then `2` as number
        (props, number) => {
          props.total = props.total + number;

          return acc;
        },

        // the initial object to start the `scan` with
        {
          name: app.getOption('name'),
          total: 0
        }
      );
  }
})(RootComponent);
```
