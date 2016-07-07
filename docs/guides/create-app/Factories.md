# Factories

Factories are classes that can be defined in parent app, and can also be shared by child-apps. Unlike services, Factories would always give you a fresh new instance of the class scoped by the App that called it.

So if you are in a child-app, and you called for a Factory that was defined in root-app, you will get the instance that is scoped to your own child-app.

## Creating a new Factory

```js
// ./factories/Request.js

import { createFactory } from 'frint';

export default createFactory({
  get(alias, queryParams) {
    this.app
      .getService('http')
      .get('http://example.com/' + alias, queryParams);
  }
})
```

## Defining it in your App

```js
// ./app/index.js

import { createApp } from 'frint';

import Request from '../Factories/Request';

export default createApp({
  factories: {
    request: Request
  }
});
```

## Accessing the factory

When you have access to the App instance, you can get the instance of your factory as:

```js
const request = app.getFactory('request');

request
  .get(myAliasHere, queryParams)
  .then(response => console.log(response));
```

When you have the instance of your Factory, `this.app` inside your Factory will always resolve to the app which called for it, irrespective of where it was defined originally.

Example, if root-app defined Request factory, and child-app did a `childApp.getFactory('request')`, inside the factory instance, `this.app` would be a reference of `childApp`.

## Accessing other Factories from within a Factory

All factories have access to the App instance that returned the factory instance, so getting other factory instances would be like this:

```js
// ./factories/MyOtherFactory.js

import { createFactory } from 'frint';

export default createFactory({
  doSomething() {
    return this.app
      .getFactory('request') // now you have the Request factory instance
      .get(alias);
  }
})
```

Just like how you can access Factories, you can also access Services from within Factories, given you have access to the `app` instance locally.
