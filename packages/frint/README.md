# frint

[![npm](https://img.shields.io/npm/v/frint.svg)](https://www.npmjs.com/package/frint)

> The base of Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Terminologies](#terminologies)
  - [Usage](#usage)
  - [Creating and registering apps](#creating-and-registering-apps)
  - [Understanding Providers](#understanding-providers)
- [API](#api)
  - [App](#app)
  - [createApp](#createapp)
  - [app](#app-1)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.0.1/Rx.min.js"></script>

<script src="https://unpkg.com/frint@latest/dist/frint.min.js"></script>
<script>
  // available as `window.Frint`
</script>
```

## Terminologies

* `Root App`: The top-most parent App, where other Apps get registered to.
* `App`: Apps that register themselves to Root App.
* `Provider`: Dependency for your apps.

## Usage

Let's import the necessary functions from the library first:

```js
const Frint = require('frint');
const { createApp } = Frint;
```

Now we can create our App:

```js
const RootApp = createApp({ name: 'MyAppName' });
```

Instantiate the Root app:

```js
const app = new RootApp(); // now you have the Root app's instance

// usually we set the root app to `window.app`,
// so apps coming in from separate bundles can register themselves
window.app = app;
```

## Creating and registering apps

```js
const { createApp } = Frint;

const MyApp = createApp({ name: 'MyAppName' });
```

To register the App in your Root App:

```js
window.app.registerApp(MyApp);
```

## Understanding Providers

Providers are dependencies for your Frint application (not to be confused with `npm` packages).

They can be set at Root app level, at App level, or even only at Root app level but cascade them to other Apps.

### Direct values

For values that are already known:

```js
const RootApp = createApp({
  name: 'MyAppName',
  providers: [
    {
      name: 'foo',
      useValue: 'foo value here'
    }
  ]
});

const app = new RootApp();
app.get('foo') === 'foo value here';
```

### Generated values from factories

If you want to get the value from a function (will be called only once during App construction):

```js
const RootApp = createApp({
  name: 'MyAppName',
  providers: [
    {
      name: 'bar',
      useFactory: function () {
        return 'bar value';
      }
    },
  ]
});

const app = new RootApp();
app.get('bar') === 'bar value';
```

### Classes

You can also have classes defined as providers. They will be instantiated when the App is constructed, and then made available to you:

```js
class Baz {
  getValue() {
    return 'baz value';
  }
}

const RootApp = createApp({
  name: 'MyAppName',
  providers: [
    {
      name: 'baz',
      useClass: Baz
    }
  ]
});

const app = new RootApp();
app.get('baz').getValue() === 'baz value';
```

### Cascading

If you wish to cascade a provider from Root App to other Apps, you can:

```js
const RootApp = createApp({
  name: 'MyRootApp',
  providers: [
    {
      name: 'window',
      useValue: window, // the global `window` object
      cascade: true,
    }
  ]
});

const MyApp = createApp({
  name: 'MyApp'
});

const app = new RootApp();
app.registerApp(MyApp);

app.get('window') === window;
app.getAppInstance('MyApp').get('window') === window;
```

### Reserved provider names

* `app`: The current App in scope
* `rootApp`: Always refers to the top-most App (which is Root)

### Dependencies

Providers can also list their dependencies (by their names).

```js
class Baz {
  constructor({ foo, bar, app }) {
    // I have access to both `foo` and `bar` here.
    // And I can access the scoped `app` instance too.
  }
}

const RootApp = createApp({
  name: 'MyRootApp',
  providers: [
    {
      name: 'foo',
      useValue: 'foo value'
    },
    {
      name: 'bar',
      useFactory: function ({ foo }) {
        return `In bar, I have foo's value: ${foo}`
      },
      deps: ['foo'] // value's of provider names listed here will be fed as arguments
    },
    {
      name: 'baz',
      useClass: Baz,
      deps: ['foo', 'bar', 'app']
    }
  ],
})
```

### Scoped

When cascading providers from Root to other Apps, it is likely you may want to scope those values by the App they are targeting. It is applicable in only `useFactory` and `useClass` usage, since they generate values.

```js
const RootApp = createApp({
  name: 'MyRootApp',
  providers: [
    {
      name: 'theNameOfTheApp',
      useFactory: function ({ app }) {
        return app.app.getName();
      },
      deps: ['app'],
      cascade: true,
      scoped: true,
    }
  ]
});

const MyApp = createApp({
  name: 'MyApp'
});

const app = new RootApp();
app.registerApp(MyApp);

app.get('theNameOfTheApp') === 'MyRootApp';
app.getAppInstance('MyApp').get('theNameOfTheApp') === 'MyApp';
```

---

# API

## App

> App

The base App class.

## createApp

> createApp(options)

### Arguments

1. `options` (`Object`)
    * `options.name`: (`String` [required]): Name of your App.
    * `options.initialize`: (`Function` [optional]): Called when App is constructed.
    * `options.beforeDestroy`: (`Function` [optional]): Called when App is about to be destroyed.
    * `options.providers`: (`Array` [optional]): Array of provider objects.

### Returns

`App`: App class.

## app

> const app = new App();

The `App` instance

### app.getOption

> app.getOption(key)

#### Arguments

1. `key` (`String`)

#### Returns

`Any`.

#### Example

`app.getOption('name')` would give you `MyAppName` string.

### app.getName

> app.getName()

#### Returns

`String`: The App's name.

### app.getRootApp

> app.getRootApp()

#### Returns

`App`: Gives you the Root App instance.

### app.getParentApp

> app.getParentApp()

#### Returns

`App`: Gives you the immediate Parent App instance.

### app.getParentApps

> app.getParentApps()

### Returns

`Array`: Array of parent apps, with immediate parent app as first element and the root app being the last.

### app.getProviders

> app.getProviders()

Gives you an array of provider definitions as passed while creating the App class.

#### Returns

`Array`: Array of provider definitions as passed while creating the App class.

### app.getProvider

> app.getProvider(name)

Gives you the provider's original definition.

#### Arguments

1. `name` (`String`): The name of the provider that you want

#### Returns

`Object`: The provider definition

Not to be confused with the computed value of the provider.

### app.get

> app.get(name)

Gives you the computed value of the provider.

#### Arguments

1. `name` (`String`): The name of the provider

#### Returns

`Any`: The computed value of the provider.

### app.getApps$

> app.getApps$(regionName = null)

#### Arguments

1. `regionName` (`String` [optional]): Filter the list of apps by region names if needed

#### Returns

`Observable`: That emits an array of most recent available Apps.

### app.registerApp

> app.registerApp(App, options = {})

Register App class to Root app.

#### Arguments

1. `App` (`App`): The App class.
1. `options` (`Object` [optional])
    * `name` (`String` [optional]): If the App's name needs to be overridden.
    * `multi` (`Boolean` [optional]): If the App is a multi-instance app (defaults to `false`)

#### Returns

`void`

### app.hasAppInstance

> app.hasAppInstance(name, region = null, regionKey = null)

Check if App instance is available or not.

#### Arguments

1. `name` (`String`): The name of the App that you are looking for
1. `region` (`String` [optional]): If you want the App of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance App, then the lookup can be scoped by region's keys.

#### Returns

`Boolean`: A flag indicating whether an App instance whose name matches the provided `name` parameter is available or not

### app.getAppInstance

> app.getAppInstance(name, region = null, regionKey = null)

Gets the App instance if available.

#### Arguments

1. `name` (`String`): The name of the App that you are looking for
1. `region` (`String` [optional]): If you want the App of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance App, then the lookup can be scoped by region's keys.

#### Returns

`App|Boolean`: The app instance, or false if not availble.

### app.getAppOnceAvailable$

> app.getAppOnceAvailable$(name, region = null, regionKey = null)

Returns an Observable, which emits with the App's instance once it is available.

#### Arguments

1. `name` (`String`): The name of the App that you are looking for
1. `region` (`String` [optional]): If you want the App of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance App, then the lookup can be scoped by region's keys.

#### Returns

`Observable`: Emits the App instance once found, only once.

### app.instantiateApp

> app.instantiateApp(name, region = null, regionKey = null)

Instantiates the registered App class, (for the targetted region/regionKey if it is a multi-instance App).

#### Arguments

1. `name` (`String`): The name of the App that you are looking for
1. `region` (`String` [optional]): If you want the App of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance App, then the lookup can be scoped by region's keys.

#### Returns

`Array`: The updated collection of apps.

### app.destroyApp

> app.destroyApp(name, region = null, regionKey = null)

Destroys App instance.

#### Arguments

1. `name` (`String`): The name of the App that you are looking for
1. `region` (`String` [optional]): If you want the App of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance App, then the lookup can be scoped by region's keys.

#### Returns

`void`.
