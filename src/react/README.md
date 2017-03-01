# react

> React plugin of Frint

## Terminologies

**React**:

* `JSX`: [Syntatic sugar](https://facebook.github.io/react/docs/jsx-in-depth.html) for writing JS in XML-like syntax.
    * `HyperScript`: The function used in transpiled JSX code.
* `Component`: [React Components](https://facebook.github.io/react/docs/react-component.html).
* `Container`: [Higher-Order Component](https://facebook.github.io/react/docs/higher-order-components.html), to pass down props to dumb components.

**Reactive programming**:

* `Observable`: As detailed in the [spec](https://github.com/tc39/proposal-observable), and implemented in [RxJS](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html).

**Frint**:

* `Region`: Component that can be embedded anywhere

## Usage

```js
const Frint = require('frint');
const { createComponent } = Frint;
```

---

# API

## createComponent

> createComponent(options)

Creates a new Component, using React internally.

### Arguments

1. `options` (`Object`):
    * `render` (`Function` [required]): Function returning JSX.
    * `beforeMount` (`Function`): Called before mounting the Component.
    * `afterMount` (`Function`): Called after mounting the Component.
    * `beforeUnmount` (`Function`): Called right before unmounting the Component.

### Returns

`Component`: React Component.

## h

> h(type, props, children)

The hyperscript wrapping React's [`React.createElement`](https://facebook.github.io/react/docs/react-api.html#createelement). This function is expected to be in the scope wherever JSX is used.

## PropTypes

> PropTypes

For [typechecking](https://facebook.github.io/react/docs/typechecking-with-proptypes.html) Component's props.

## render

> render(app, node)

Renders a Core App in target DOM node.

### Arguments

1. `app` (`App`): The Core App instance.
1. `node` (`Element`): The DOM Element where you want your App to render.

## observe

> observe(fn)(MyComponent)

### Arguments

1. `fn` (`Function`): The function returning an Observable.
    * The `fn` accepts `app` as an argument, which is the instance of your Core App or Widget in the scope
    * It should return an `Observable`

### Returns

`Function`: that can be called with a Component to return an observed Component ready for embedding and rendering anywhere.

## Region

> Region

The Region component.

### Props

1. `name` (`String`): The name of the Region
1. `data` (`Object`): Data to be made available to rendered Widgets
1. `uniqueKey` (`String` [optional]): Used when there are multiple Regions of the same `name`. It prop must be unique and fixed thoughout the whole app.

## RegionService

> RegionService

If your Widget wishes to receive data coming from the Region component it rendered in, RegionService is your way to access it.

Methods exposed by the instance:

### emit

> emit(props)

The props that need to be emitted (Region component uses it internally).

#### Arguments

1. `props` (`Object`)

#### Returns

`void`.

### getProps$

> getProps$()

#### Returns

`Observable`: of emitted props from the Region component.

### getData$

> getdata$()

#### Returns

`Observable`: of the `data` prop from the Region component.

## streamProps

Helper function, for composing your props inside `observe`, and then generating and returning an single `Observable`.

### Arguments

1. `defaultProps` (`Object` [optional]): Default props to start with.

### Returns

`Streamer` instance that implements these methods below:

All `set*` methods return the same `Streamer` instance so multiple set calls can be chained in one go.

#### set

> set(key, value)
> set(plainObject)
> set(observable$, ...mapperFunctions)

#### setKey

> setKey('key', 'value')

#### setPlainObject

> setPlainObject({ key: 'value' })

#### setObservable

> setObservable(observable$, ...mapperFunctions)

You can set as many mapper functions until you reach a value of your needs.

```js
setObservable(
  observable$,
  props => props, // no modification
  propsAgain => modifiedProps // with modification
)
```

#### setDispatch

> setDispatch(actionCreators, store)

```js
setDispatch({
  incrementCounter: incrementCounter,
  decrementCounter: decrementCounter,
}, store)
```

#### get$

> get$()

Returns an `Observable`.

## app

The base App class is extended with these methods, affecting all Core Apps and Widgets.

### app.getComponent

> app.getComponent()

#### Returns

`Component`: The root component wrapped in a `<Provider>` to keep the App's instance in the context of the component, as well as sharing the same context among the Component's children.
