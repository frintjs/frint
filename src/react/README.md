# react

> React plugin of Frint

<!-- MarkdownTOC autolink=true bracket=round -->

  - [Terminologies](#terminologies)
  - [Usage](#usage)
  - [Regions](#regions)
  - [Region and data](#region-and-data)
  - [Observing components](#observing-components)
  - [Multi-instance Widgets](#multi-instance-widgets)
- [API](#api)
  - [createComponent](#createcomponent)
  - [h](#h)
  - [PropTypes](#proptypes)
  - [render](#render)
  - [observe](#observe)
  - [Region](#region)
  - [RegionService](#regionservice)
  - [streamProps](#streamprops)
  - [app](#app)

<!-- /MarkdownTOC -->

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

We start by importing the necessary functions from the library:

```js
const Frint = require('frint');
const { h, createCore, createComponent, render } = Frint;
```

Now let's create our first Component:

```js
/** @jsx h */
const Root = createComponent({
  render() {
    return (
      <div>
        Hello World
      </div>
    );
  }
});
```

Now we need to create our Core App, and assign the previously defined Component as our root component for the App:

```js
const CoreApp = createCore({
  name: 'MyCoreApp',
  providers: [
    {
      name: 'component',
      useValue: Root
    }
  ]
});
```

Now that we have everything ready, we can instantiate our app, and render it:

```js
window.app = new CoreApp();
render(window.app, document.getElementById('root'));
```

The code above asumes your page has an element with an id `root`:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## Regions

The library already ships with a `Region` component, and a `RegionService`.

We use the concept of regions for defining areas in our Components (either in a Core App or a Widget), where other Widgets can load themselves in.

For example, imagine the Root component of our Core App above, we can define a Region named `sidebar` as follows:

```js
/** @jsx h */
const { Region } = Frint;

const Root = createComponent({
  render() {
    return (
      <div>
        <p>Hello World from Core App!</p>

        <Region name="sidebar" />
      </div>
    );
  }
});
```

That's just defining the Region only. Let's now create a Widget, and assign it to the `sidebar` region:


```js
/** @jsx h */
const { createWidget } = Frint;

const WidgetComponent = createComponent({
  render() {
    return <p>I am Widget</p>;
  }
});

const Widget = createWidget({
  name: 'MyWidget',
  providers: [
    {
      name: 'component',
      useValue: WidgetComponent,
    }
  ],
});
```

Now that we have our Widget defined, we can register it to our Core App:

```js
window.app.registerWidget(Widget, {
  regions: ['sidebar'], // name of regions to target
  weight: 10, // the lower the number, the higher they would appear
});
```

Now when you refresh your browser, you would notice your Widget being rendered inside the Region `sidebar`.

## Region and data

It is possible that when defining the Region with a name, you would also want to pass some data to it, so that whenever a Widget gets rendered inside it, the Widget would be able to access that data.

From the above example of `sidebar` Region, imagine us passing some data too via props:

```js
/** @jsx h */
const Root = createComponent({
  render() {
    const data = {
      foo: 'bar'
    };

    return (
      <div>
        <p>Hello World from Core App!</p>

        <Region name="sidebar" data={data} />
      </div>
    );
  }
});
```

That's only the `Region` component's implementation part. How do we access it from our Widget now?

Enter `RegionService`. This is a Service that we can pass in our Widget's providers list, allowing us to later have access to Region's props.

```js
const { RegionService } = Frint;

const Widget = createWidget({
  name: 'MyWidget',
  providers: [
    {
      name: 'component',
      useValue: WidgetComponent
    },
    {
      name: 'region',
      useClass: RegionService, // `useClass` because `RegionService` will be instantiated
    }
  ],
});
```

Once your Widget is registered and rendered, you can get access to your Widget instance, which can then allow you to deal with Region's props:

```js
const myWidget = window.app.getWidgetInstance('MyWidget');
const region = myWidget.get('region');

// Region's data as an Observable
const regionData$ = region.getData$();

regionData$.subscribe((data) => {
  console.log(data); // { foo: 'bar' }
});
```

We will dicuss more in details how to get Region's props in your Widget's components via `observe` in the next section.

## Observing components

We encourage everyone to write their components in as dumb way as possible. Meaning, we just pass the props, and Components just render them. Nothing more.

But real-world applications are complex, and data can come from anywhere, at any time, asynchronously.

Enter `observe`. This is a function that we ship with the library for making your Components reactive.

A very simple example would be:

```js
/** @jsx h */
const { createComponent, h } = Frint;

const MyComponent = createComponent({
  render() {
    return <p>Interval: {this.props.interval}</p>;
  }
});
```

We just created a component, that prints out a prop called `interval`. Nothing fancy there. But we wish the interval to update itself every second. Instead of handling it from within the Component, we can do it with `observe` as follows:

```js
/** @jsx h */
const Rx = require('rxjs');
const { observe } = Frint;

const MyObservedComponent = observe(function () {
  return Rx.Observable
    .interval(1000) // emits an integer every 1 second
    .map(x => ({ interval: x })); // map the integer to a props-compatible object
})(MyComponent);
```

We have just made our simple Component reactive, by wrapping it with `observe`. Now it will continue to update the `interval` prop every second until the Component has unmounted itself.

### Observing Region's data

In previous example, we showed you how to access Region's data via `RegionService`. Now let's see how we can pass it to your Widget's component too:

```js
const ObservedWidgetComponent = observe(function (app) {
  // `app` is your Widget instance

  // let's keep our first interval Observable too
  const interval$ = Rx.Observable
    .interval(1000)
    .map(x => ({ interval: x }));

  const region = app.get('region'); // the RegionService instance
  const regionData$ = region.getData$()
    .map(regionData => ({ regionData: regionData }));

  // now we have two observables, `interval$` and `regionData$`.
  // we need to merge them both into a single props-compatible object:
  return interval$
    .merge(regionData$)
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {});
})(WidgetComponent);
```

When your Widget's component renders, latest props will be passed to it in this structure:

```js
{
  // will keep updating every second,
  interval: 1,

  // will update whenever sidebar Region's props change
  regionData: {
    foo: 'bar'
  }
}
```

### Helper function for streaming props

As the number of observables grow, it might be difficult to maintain your `observe` implementation. That's why we are also shipping a `streamProps` function in the library to make it easier for you:

```js
const { streamProps } = Frint;

const MyObservedComponent = observe(function (app) {
  return streamProps({}) // start streaming with a default plain object
    // interval
    .set(
      Rx.Observable.interval(1000),
      x => ({ interval: x }),
    )

    // region data
    .set(
      app.get('region').getData$(),
      regionData => ({ regionData })
    )

    // plain object
    .set({
      key: 'value'
    })

    // key/value pairs
    .set('myKey', 'myValue')

    // return everything as a single merged Observable
    .get$();
})(WidgetComponent);
```

The props available inside your Component would then be in this format:

```js
{
  interval: 1,
  regionData: { foo: 'bar' },
  key: 'value',
  myKey: 'myValue'
}
```

## Multi-instance Widgets

This is a use case where you have multiple instances of Region with the same name mounted in the DOM. And the widgets rendered in them should have their own independent scoped instances too.

Think of a scenario where you have a TodoList, and you want a Region defined for each Todo item:

```js
/** @jsx h */
const MyComponent = createComponent({
  render() {
    const todos = [
      { id: '1', title: 'First todo' },
      { id: '2', title: 'Second todo' },
      { id: '3', title: 'Third todo' },
    ];

    return (
      <ul>
        {todos.map((todo) => {
          return (
            <li>
              <h3>{todo.title}</h3>

              <Region
                name="todo-item"
                data={{ todo }}
                uniqueKey={`todo-item-${todo.id}`}
              />
            </li>
          );
        })}
      </ul>
    );
  }
});
```

Now we may have a Widget that we want to be rendered in `todo-item` Regions.

Let's create a Widget, that will receive the `todo` object, and render the title in UPPERCASE format.

```js
/** @jsx h */
const {
  createComponent,
  createWidget,
  h,
  observe,
  RegionService
} = Frint;

const WidgetComponent = createComponent({
  render () {
    const { todo } = this.props;

    return <p>Todo in upper case: {todo.title.toUpperCase()}</p>
  }
});

const ObservedWidgetComponent = observe(function (app) {
  return streamProps()
    .set(
      app.get('region').getData$(),
      data => ({ todo: data.todo })
    )
    .get$();
})(WidgetComponent);

const Widget = createWidget({
  name: 'MyWidget',
  providers: [
    {
      name: 'component',
      useValue: ObservedWidgetComponent
    },
    {
      name: 'region',
      useClass: RegionService
    }
  ]
});
```

Now comes the part of registering our Widget as a multi-instance widget:

```js
window.app.registerWidget(Widget, {
  regions: ['todo-item'],

  // this tells Core App to treat this widget as a multi-instance one
  multi: true
});
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

> new App()

The base App class is extended with these methods, affecting all Core Apps and Widgets.

### app.getComponent

> app.getComponent()

#### Returns

`Component`: The root component wrapped in a `<Provider>` to keep the App's instance in the context of the component, as well as sharing the same context among the Component's children.
