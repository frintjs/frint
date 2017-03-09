---
title: Providers
sidebarPartial: guidesSidebar
---

# Providers

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [The need for Providers](#the-need-for-providers)
- [Assigning providers](#assigning-providers)
- [Provider dependencies](#provider-dependencies)

<!-- /MarkdownTOC -->

## The need for Providers

[Previously](../apps), we discussed how Apps work in Frint. We were only assigning a name, and then registering Widgets. Simple.

But how do we put more things inside our Apps? Like:

* A store for state management
* A Component for rendering
* A service for communicating to our API servers
* A special string, or configuration object, etc...

We define them as providers.

The [API docs](../../docs/packages/frint#understanding-providers) for providers can be found in `frint` package. which explains the usage in great details.

## Assigning providers

We can do that when defining our App:

```js
import { createApp } from 'frint';

const App = createApp({
  name: 'MyApp',
  providers: [
    // direct values
    { name: 'key', useValue: 'value' },

    // values derived from a function
    { name: 'foo', useFactory: () => 'foo value' },

    // or even a class, that will be instantiated for you as its computed value
    { name: 'bar', useClass: Bar }
  ]
});
```

Now that you have your providers defined, you can access them by doing simply:

```js
const app = new App();

app.get('key'); // `value`
app.get('foo'); // `foo value`
```

And assuming you had a `Bar` class like this:

```js
class Bar {
  getValue() {
    return 'bar value';
  }
}
```

That can be access from your App instance as follows:

```js
app.get('bar').getValue(); // `bar value`
```

## Provider dependencies

Providers can also depend on other providers.

Imagine you have a `baz` provider, that needs to know the value of `foo`:

```js
const App = createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'foo',
      useValue: 'foo value'
    },
    {
      name: 'baz',
      // the dependencies are given as an argument
      useFactory: function ({ foo }) {
        // `foo` is `foo value` here
        return 'baz value';
      },
      deps: ['foo'], // we give an array of dependency names
    }
  ]
});
```

Same can be done with classes via `useClass` too. The dependencies will then be given as the constructor argument of the class.
