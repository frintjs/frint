# createApp

Helps you create a new App class for your app, by passing a plain object of configuration.

## Usage

```js
// app/index.js

import { createApp } from 'frint';

const App = createApp({
  name: 'MyAppName'
});

const app = new App(); // you can pass options here too
```

## Options

### name

Pass the name of your app as a string.

### reducer

Pass your root reducer, created via `combineReducer`.

### initialState

The initial state that your reducers with start with for the Store.

### component

The component that you created via `createComponent`.

### models

A list of model classes keyed by names, which will then be accessible via `app.getModel(name)` from the App instance.

Models can optionally have initial attributes declared as part of `modelAttributes`.

```js
import Shirt from '../models/Shirt';

const App = createApp({
  modelAttributes: {
    shirt: {
      color: 'blue',
      size: 'medium'
    }
  },
  models: {
    shirt: Shirt
  },
});
```

### modelAttributes

See [models](#models) for more information on `modelAttributes`.

### services

A list of Service classes keyed by names, by which you can access them via `app.getService(keyName)` later.

```js
import Http from '../services/Http';

const App = createApp({
  services: {
    http: Http
  }
});
```

### factories

A list of Factory classes keyed by names, by which you can access them via `app.getFactory(keyName)` later.

```js
import Request from '../factories/Request';

const App = createApp({
  factories: {
    request: Request
  }
});
```

### beforeMount

Function that is called before your App is mounted.

### afterMount

Function that is called after your App has mounted.

### beforeUnmount

Function that is called right before unmounting your App.

## Methods

Please see dedicated [App](./App.md) section for the methods.
