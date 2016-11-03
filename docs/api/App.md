# App

App class are created via `createApp` function. Once instantiated they expose these methods below.

## Methods

### getOption(optionName)

Returns a specific option that was passed to it during construction.

### createStore(rootReducer, initialState = {})

Used internally.

@TODO: should this be removed from public API?

### getStore(appName)

If no `appName` is given, it would fetch the store of the current app instance.

Returns the Store of an App by its name.

@TODO: could this be removed from public API?

### getState$(appName)

If no `appName` is given, it would fetch the state of the current app instance.

Returns the state of an app as an Observable.

### dispatch(action)

Dispatches action to the current Store.

### getRootApp()

Returns the Root app if exists.

### getModel(name)

Returns the instance of Model. First looks for its existence in the current app, then parent app.

### getService(name)

Returns the instance of Service. First looks for its existence in the current app, then parent app.

### getFactory(name)

Returns a fresh new instance for the given Factory name. First looks for its existence in the current app, then parent app.

### registerWidget(widgetApp, regionName)

For registering child apps (widgets), to parent app.

```js
parentApp.registerWidget(childApp, 'sidebar');
```

### beforeMount()

Called before mounting the app.

### getL10ns()

Returns the `L10ns` instance from the root app.

### render()

Returns a Component ready to be embedded into another Component, or render to DOM directly.

### afterMount()

Called after mounting the app.

### beforeUnmount()

Called right before unmounting the app.

### setRegion(regionName)

To be called from the child-app, for setting its region in the parent app.

```js
childApp.setRegion('sidebar');
```

### setRegions(regionNames)

Similar to `setRegion`, but accepts an array of multiple region names:

```js
childApp.setRegions(['sidebar', 'footer']);
```

### getWidgets(regionName)

Returns a list of child apps, by a specific region. Returns all the child apps, irrespective of their region, if no `regionName` is provided.

### observeWidgets$()

Returns an observable, that you can subscribe to. Emit's a `next` event every time there is a change in the list of registered widgets.

### readStateFrom(appNames)

Set child app's access to other apps by their names as an array.

```js
childApp.readStateFrom([
  'myOtherApp',
  'anotherApp'
]);
```
