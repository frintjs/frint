# core

> Core plugin of Frint

## Terminologies

* `App`: The base for Core and Widgets.
* `Core`: The root app, that renders to DOM directly.
* `Widget`: Apps that register themselves to Core.
* `Provider`: Dependency for your apps (Core and Widgets).

## Usage

Let's import the necessary functions from the library first:

```js
const Frint = require('frint');
const { createCore, createWidget } = Frint;
```

Now we can create our classes:

```js
const CoreApp = createCore({ name: 'MyAppName' });
const MyWidget = createWidget({ name: 'MyWidgetName' });
```

Instantiate the Core app:

```js
const app = new CoreApp(); // now you have the Core app's instance

// usually we set the core app to `window.app`,
// so Widgets coming in from separate bundles can register themselves
window.app = app;
```

To register the Widget:

```js
app.registerWidget(MyWidget);
```

### Providers

Providers are dependencies for your Frint application (not to be confused with `npm` packages).

They can be set at Core app level, at Widget level, or even only at Core app level but cascade them to the Widgets.

#### Direct values

For values that are already known:

```js
const CoreApp = createCore({
  name: 'MyAppName',
  providers: [
    {
      name: 'foo',
      useValue: 'foo value here'
    }
  ]
});

const app = new CoreApp();
app.get('foo') === 'foo value here';
```

#### Values from factories

If you want to get the value from a function (will be called only once during App construction):

```js
const CoreApp = createCore({
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

const app = new CoreApp();
app.get('bar') === 'bar value';
```

#### Classes

You can also have classes defined as providers. They will be instantiated when the App is constructed, and then made available to you:

```js
class Baz {
  getValue() {
    return 'baz value';
  }
}

const CoreApp = createCore({
  name: 'MyAppName',
  providers: [
    {
      name: 'baz',
      useClass: Baz
    }
  ]
});

const app = new CoreApp();
app.get('baz').getValue() === 'baz value';
```

#### Cascading

If you wish to cascade a provider from Core App to your Widgets, you can:

```js
const CoreApp = createCore({
  name: 'MyCoreApp',
  providers: [
    {
      name: 'window',
      useValue: window, // the global `window` object
      cascade: true,
    }
  ]
});

const MyWidget = createWidget({
  name: 'MyWidget'
});

const app = new CoreApp();
app.registerWidget(MyWidget);

app.get('window') === window;
app.getWidgetInstance('MyWidget').get('window') === window;
```

#### Reserved provider names

* `app`: The current App in scope (Core or Widget)
* `rootApp`: Always refers to the top-most App (which is Core)

#### Dependencies

Providers can also list their dependencies (by their names).

```js
class Baz {
  constructor({ foo, bar, app }) {
    // I have access to both `foo` and `bar` here.
    // And I can access the scoped `app` instance too.
  }
}

const CoreApp = createCore({
  name: 'MyCoreApp',
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

#### Scoped

When cascading providers from Core to Widgets, it is likely you may want to scope those values by the Widget they are targeting. It is applicable in only `useFactory` and `useClass` usage, since they generate values.

```js
const CoreApp = createCore({
  name: 'MyCoreApp',
  providers: [
    {
      name: 'theNameOfTheApp',
      useFactory: function ({ app }) {
        return app.getOption('name');
      },
      deps: ['app'],
      cascade: true,
      scoped: true,
    }
  ]
});
const MyWidget = createWidget({
  name: 'MyWidget'
});

const app = new CoreApp();
app.registerWidget(MyWidget);

app.get('theNameOfTheApp') === 'MyCoreApp';
app.getWidgetInstance('MyWidget').get('theNameOfTheApp') === 'MyWidget';
```

---

# API

## App

> App

The base App class.

Core and Widget extend this class.

## createCore

> createCore(options)

### Arguments

1. `options` (`Object`)
    * `options.name`: (`String` [required]): Name of your App
    * `options.initialize`: (`Function` [optional]): Called when App is constructed
    * `options.providers`: (`Array` [optional]): Array of provider objects

### Returns

`App`: The generated App class based on `options`.

## createWidget

> createWidget(options)

Same as `createCore`, but intended for creating Widgets, that get registered to Core apps.

## createClass

> createClass(methods)

Creates and returns a ES6 compatible class.

Useful in non-ES6 compatible environments.

### Arguments

1. `options` (`Object`)
    * `initialize` (`Function`): To be used as a regular class constructor.

### Returns

`Function`: ES6 compatible class.

## app

> const app = new App();

The `App` instance (either Core or Widget):

### app.getOption

> app.getOption(key)

#### Arguments

1. `key` (`String`)

#### Returns

`Any`.

#### Example

`app.getOption('name')` would give you `MyAppName` string.

### app.getRootApp

> app.getRootApp()

#### Returns

Gives you the Core App instance.

### app.getProviders

> app.getProviders()

Gives you an array of provider definitions as passed while creating the App class.

#### Returns

`Array`.

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

### app.getWidgets$

> app.getWidgets$(regionName = null)

#### Arguments

1. `regionName` (`String` [optional]): Filter the list of widgets by region names if needed

#### Returns

`Observable`: That emits an array of most recent available Widgets.

### app.registerWidget

> app.registerWidget(Widget, options = {})

Register Widget class to Core app.

#### Arguments

1. `Widget` (`App`): The widget class created via `createWidget`.
1. `options` (`Object` [optional])
    * `name` (`String` [optional]): If the Widget's name needs to be overridden.
    * `multi` (`Boolean` [optional]): If the Widget is a multi-instance widget (defaults to `false`)

#### Returns

`void`

### app.hasWidgetInstance

> app.hasWidgetInstance(name, region = null, regionKey = null)

Check if Widget instance is available or not.

#### Arguments

1. `name` (`String`): The name of the Widget that you are looking for
1. `region` (`String` [optional]): If you want the Widget of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance Widget, then the lookup can be scoped by region's keys.

#### Returns

`Boolean`.

### app.getWidgetInstance

> app.getWidgetInstance(name, region = null, regionKey = null)

Gets the Widget instance if available.

#### Arguments

1. `name` (`String`): The name of the Widget that you are looking for
1. `region` (`String` [optional]): If you want the Widget of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance Widget, then the lookup can be scoped by region's keys.

#### Returns

`App|Boolean`: The widget instance, or false if not availble.

### app.getWidgetOnceAvailable$

> app.getWidgetOnceAvailable$(name, region = null, regionKey = null)

Returns an Observable, which emits with the Widget's instance once it is available.

#### Arguments

1. `name` (`String`): The name of the Widget that you are looking for
1. `region` (`String` [optional]): If you want the Widget of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance Widget, then the lookup can be scoped by region's keys.

#### Returns

`Observable`: Emits the Widget instance once found, only once.

### app.instantiateWidget

> app.instantiateWidget(name, region = null, regionKey = null)

Instantiates the registered Widget class, (for the targetted region/regionKey if it is a multi-instance Widget).

#### Arguments

1. `name` (`String`): The name of the Widget that you are looking for
1. `region` (`String` [optional]): If you want the Widget of a specific region
1. `regionKey` (`String` [optional]): If it is a multi-instance Widget, then the lookup can be scoped by region's keys.

### Returns

`Array`: The updated collection of widgets.
