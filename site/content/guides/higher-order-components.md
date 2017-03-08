---
title: Higher-Order Components
sidebarPartial: guidesSidebar
---

# Higher Order Components (HOCs)

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [What is an HOC?](#what-is-an-hoc)
- [How does it work with Frint?](#how-does-it-work-with-frint)

<!-- /MarkdownTOC -->

## What is an HOC?

[React](https://facebook.github.io/react/) has a very detailed documentation on this topic [here](https://facebook.github.io/react/docs/higher-order-components.html).

In short:

> A higher-order component is a function that takes a component and returns a new component.

## How does it work with Frint?

In our `frint-react` package, we expose an `observe` function which gives us an HOC.

### Dependencies

Install the dependencies first:

```
$ npm install --save rxjs react react-dom frint frint-react
```

### Base component

Now let's say, we have a basic React component:

```js
// components/Root.js
import React from 'react';

const MyComponent = React.createClass({
  render() {
    return (
      <p>Name: {this.props.name}</p>
    );
  }
});

export default MyComponent;
```

The component just renders a name, which is given to it as props.

### App

And the App definition happens to looks like this:

```js
// app/index.js
import { createApp } from 'frint';

import Root from '../components/Root';

export default createApp({
  name: 'MyAppNameHere',
  providers: [
    {
      name: 'component',
      useValue: Root
    }
  ]
})
```

### Observed component

But we want to inject the App's name to the component, and we could easily do that using `observe`:

```js
// components/Root.js
import { Observable } from 'rxjs';
import { observe } from 'frint-react';

const MyComponent = React.createClass({
  render() {
    return (
      <p>Name: {this.props.name}</p>
    );
  }
});

export default observe(function (app) {
  // `app` is our App's instance
  const props = {
    name: app.getOption('name') // `MyAppNameHere`
  };

  // this function must always return an Observable of props
  return Observable.of(props);
})(MyComponent);
```

### Render

Now when your App gets rendered, your Root component would show your App's name:

```js
// index.js
import { render } from 'frint-react';

import App from './app';

const app = new App();
render(app, document.getElementById('root'));
```
