# Services

Services are singletons, that are shared across everywhere. If a parent app has defined a Service, child-apps would be able to get the same instance.

## Creating a new Service

```js
// ./services/Http.js

import { createService } from 'frint';

export default createService({
  get(url) {
    return fetch(url);
  },

  post(url, data) {
    // ...
  }
})
```

## Defining it in your App

```js
// ./app/index.js

import { createApp } from 'frint';

import Http from '../services/Http';

export default createApp({
  services: {
    http: Http
  }
});
```

## Accessing the service

When you have access to the App instance, you can get the instance of your service as:

```js
const http = app.getService('http');

http
  .get(myUrlHere)
  .then(response => console.log(response));
```

## Accessing other Services from within a Service

All services have access to the App instance that defined it originally, so getting other service instances is very easy:

```js
// ./services/MyOtherService.js

import { createService } from 'frint';

export default createService({
  fetchSomething() {
    return this.app
      .getService('http') // now you have the Http service instance
      .get(myUrlHere);
  }
})
```
