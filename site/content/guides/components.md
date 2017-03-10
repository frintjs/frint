---
title: Components
sidebarPartial: guidesSidebar
---

# Components

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [What is a Component?](#what-is-a-component)
- [How to create a component?](#how-to-create-a-component)
- [Assigning your root component to App](#assigning-your-root-component-to-app)
- [Rendering your App](#rendering-your-app)

<!-- /MarkdownTOC -->

## What is a Component?

A component can be any function that renders your view. We use [React](https://facebook.github.io/react/) for creating our Components, and support it officially in frint with the `frint-react` package.

## How to create a component?

With React:

```js
import React, { Component } from 'react';

class MyComponent extends Component {
  render() {
    return <p>Hello World</p>;
  }
}
```

## Assigning your root component to App

We can do it as a provider, with a special reserved key called `component`:

```js
import { createApp } from 'frint';

const App = createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'component',
      useValue: MyComponent
    }
  ]
});
```

## Rendering your App

Now that you have an App with a Component, it can be rendered to DOM:

```js
import { render } from 'frint-react';

const app = new App();
render(app, document.getElementById('root'));
```

The code above assumes your HTML page markup looks like this:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
  </body>
</html>
```
