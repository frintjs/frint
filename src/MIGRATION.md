# Migration for v0.x users

We are still keeping majority of the API in `v0.x` backwards compatible with the new `v1.x`.

But using old API would give you deprecated warnings, and they can be eliminated by following the guide below.

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [Creating Core Apps and Widgets](#creating-core-apps-and-widgets)
- [Root components](#root-components)
- [Store](#store)
- [Services](#services)
- [Factory](#factory)
- [Models](#models)
- [`mapToProps`](#maptoprops)

<!-- /MarkdownTOC -->

## Creating Core Apps and Widgets

### `v0.x`

```js
import { createApp } from 'frint';

const App = createApp({
  name: 'MyApp'
});
```

### `v1.x`

```js
import { createCore, createWidget } from 'frint';

const CoreApp = createCore({
  name: 'MyApp'
});

const Widget = createWidget({
  name: 'MyWidget'
})
```

## Root components

### `v0.x`

```js
import { createApp } from 'frint';

const App = createApp({
  name: 'MyApp',
  component: MyComponent
});
```

### `v1.x`

Components are optional in `v1.x`:

```js
import { createApp } from 'frint';

const App = createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'component',
      useValue: MyRootComponent
    }
  ]
});
```

## Store

### `v0.x`

```js
import { createApp } from 'frint';

const App = createApp({
  name: 'MyApp',
  reducer: rootReducer,
  initialState: {}
});

const app = new App();
const store = app.getStore();
```

### `v1.x`

Applies to both `createCore` and `createWidget` the same way.

Stores are optional in `v1.x`:

```js
import { createCore, createStore } from 'frint';

const App = createCore({
  name: 'MyApp',
  providers: [
    {
      name: 'store',
      useFactory: function ({ app }) {
        const Store = createStore({
          reducer: rootReducer,
          initialState: {},
          thunkArgument: { app }, // for async actions
        });

        return new Store();
      },
      deps: ['app']
    }
  ]
});

const store = app.get('store');
```

## Services

### `v0.x`

```js
import { createApp, createService } from 'frint';

const FooService = createService({
  getAppName() {
    return this.app.getOption('name');
  }
});

const App = createApp({
  name: 'MyApp',
  services: {
    foo: FooService
  }
});

const app = new App();
const foo = app.getService('foo');
```

### `v1.x`

```js
import { createCore } from 'frint';

// just a regular ES6-compatible class
class FooService {
  constructor({ app }) {
    this.app = app;
  }

  getAppName() {
    return this.app.getOption('name');
  }
}

const App = createCore({
  name: 'MyApp',
  providers: [
    {
      name: 'foo',
      useClass: FooService,
      cascade: true, // if you want Widgets to access it
      deps: ['app'] // values are made available in constructor argument
    }
  ]
});

const app = new App();
const foo = app.get('foo');
```

## Factory

### `v0.x`

```js
import { createApp, createFactory } from 'frint';

const BarFactory = createFactory({
  getAppName() {
    return this.app.getOption('name');
  }
});

const App = createApp({
  name: 'MyApp',
  factories: {
    bar: BarFactory
  }
});

const app = new App();
const bar = app.getFactory('bar');
```

### `v1.x`

```js
import { createCore } from 'frint';

// just a regular ES6-compatible class
class BarFactory {
  constructor({ app }) {
    this.app = app;
  }

  getAppName() {
    return this.app.getOption('name');
  }
}

const App = createCore({
  name: 'MyApp',
  providers: [
    {
      name: 'bar',
      useClass: BarFactory,
      cascade: true, // if you want Widgets to access it
      scoped: true, // means Widgets will get a fresh new scoped instance themselves
      deps: ['app']
    }
  ]
});

const app = new App();
const bar = app.get('bar');
```

## Models

### `v0.x`

```js
import { createModel, createApp } from 'frint';

const BazModel = createModel({});

const App = createApp({
  name: 'MyApp',
  models: {
    baz: BazModel
  },
  modelAttributes: {
    baz: {
      key: 'value'
    }
  }
});

const app = new App();
const baz = app.getModel('baz');
```

### `v1.x`

```js
import { createModel, createCore } from 'frint';

const BazModel = createModel({});

const App = createCore({
  name: 'MyApp',
  providers: [
    {
      name: 'baz',
      useFactory: function () {
        return new BazModel({
          key: 'value'
        });
      },
      cascade: true
    }
  ]
});

const app = new App();
const baz = app.get('baz');
```

## `mapToProps`

### `v0.x`

```js
// ./components/Root.js
import { mapToProps, createComponent } from 'frint';
import { Observable } from 'rxjx';

import { addTodo } from '../actions/todos';

const Root = createComponent({
  render() {
    // ...
  }
});

export default mapToProps({
  state(state) => ({
    todos: state.todos.records
  }),
  dispatch: {
    handleAddButton: addTodo
  },
  app(app) {
    return {
      appName: app.getOption('name')
    }
  }),
  shared(sharedState) => ({
    counter: sharedState.SomeOtherAppName[reducerName].someKey
  }),
  services: {
    foo: 'foo'
  },
  factories: {
    bar: 'bar'
  },
  models: {
    baz: 'baz'
  },
  observe(app) {
    return Observable
      .interval(1000)
      .map(x => ({ interval: x }));
  }
})(Root);
```

### `v1.x`

The usage of `mapToProps` can be replaced with `observe`, along with a helper function `streamProps` for keeping code even shorter:

```js
// ./components/Root.js
import { observe, streamProps, createComponent } from 'frint';
import { Observable } from 'rxjx';

import { addTodo } from '../actions/todos';

const Root = createComponent({
  render() {
    // ...
  }
});

export default observe(function (app) {
  // We need to return a single Observable from this function.
  // Either manually for greater control, or using `streamProps`:

  return streamProps({}) // default props to start with
    // state
    .set(
      app.get('store').getState$(),
      state => ({ todos: state.todos.records })
    )

    // dispatch
    .setDispatch({
      handleAddButton: addTodo
    }, app.get('store'))

    // app
    .set('appName', app.getOption('name'))

    // shared state
    .set(
      app.getWidgetOnceAvailable$('SomeOtherAppName'),
      widget => widget.get('store').getState$(),
      state => ({ counter: state[reducerName].someKey })
    )

    // services
    .set('foo', app.get('foo'))

    // factories
    .set('bar', app.get('bar'))

    // models
    .set('baz', app.get('baz'))

    // observe
    .set(
      Observable.interval(1000),
      x => ({ interval: x })
    )

    // return final Observable
    .get$();
})(Root);
```
