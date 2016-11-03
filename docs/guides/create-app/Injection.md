# Props Injection

Components receive props, and render them via JSX. And those props can come from various places. To simplify the process, our library provides a `mapToProps` function.

## State

To inject state into Components, for example the list of ToDos, we could do the following in our Component:

```js
// components/Root.js

import { createComponent, mapToProps } from 'frint';

const RootComponent = createComponent({
  render() {
    const { todos } = this.props;

    return (
      <div>
        <ul>
        {todos.map((todo) => {
          return <li>{todo.title}</li>;
        })}
        </ul>
      </div>
    );
  }
});

export default mapToProps({
  state: (state) => {
    return {
      // propName: state[reducerName].someKey
      todos: state.todos.records
    };
  }
})(RootComponent);
```

The `mapToProps` function makes sure that as your state gets changed, it will get the latest data from ToDos reducer, and inject it as `todos` prop in the Component. And Component is responsible for just rendering the props it receives.

## Dispatchable Actions

Actions can be injected into Components as follows:

```js
import { createComponent } from 'frint';

import { addTodo } from '../actions/todos';

const RootComponent = createComponent({
  render() {
    const { addTodo } = this.props;

    return (
      <div>
        <a onClick={addTodo('todo title...')}>
          Click here to add ToDo
        </a>
      </div>
    );
  }
});

export default mapToProps({
  dispatch: {
    addTodo: addTodo
  }
})(RootComponent);
```

## App instance

What if you also want to inject values from your App's instance to your Components? Like the App's name?

```js
import { createComponent } from 'frint';

const RootComponent = createComponent({
  render() {
    const { appName } = this.props;

    return (
      <p>I am from app {appName}.</p>
    );
  }
});

export default mapToProps({
  app: (app) => {
    return {
      appName: app.getOption('name')
    };
  }
})(RootComponent);
```
