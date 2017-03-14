---
title: Apps
sidebarPartial: guidesSidebar
---

# Apps

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [What is an App?](#what-is-an-app)
- [How to create an App?](#how-to-create-an-app)
- [Root Apps](#root-apps)
- [Widgets](#widgets)

<!-- /MarkdownTOC -->

## What is an App?

Everything in Frint is wrapped inside an App. They contain all the bits and pieces in the form of [providers](../providers).

An App can be of two types:

* **Root App**: The root app.
* **Widget**: Apps that get registered to the root app.

## How to create an App?

An App can be created using the `frint` package:

```js
import { createApp } from 'frint';

const App = createApp({
  name: 'MyAppName'
});
```

Now you can instantiate it:

```js
const app = new App();
const name = app.getOption('name');
console.log(name); // `MyAppName`
```

## Root Apps

In any page at any given moment, there can be only one Root App. This is the top-most parent App, where Widgets can register themselves to.

Let's create one:

```js
import { createApp } from 'frint';

const RootApp = createApp({
  name: 'MyRootApp'
});
```

Now it can be instantiated:

```js
window.app = new RootApp();
```

## Widgets

Widgets are apps that get registered to the Root App.

Widgets can be created in the same way as Root Apps are created:

```js
import { createApp } from 'frint';

const Widget = createApp({
  name: 'MyWidget'
});
```

Now unlike Root Apps, Widgets are not instantiated manually. They are registered to Root Apps instead:

```js
window.app.registerWidget(Widget);
```

To access your Widget instance:

```js
window.app.getWidgetOnceAvailable$('MyWidget')
  .subscribe(function (widget) {
    const name = widget.getOption('name');
    console.log(name); // `MyWidget`
  });
```

We use observables, because a Widget may get registered at any time. Either at initial page load, or at a time in future asynchronously. They may even come from a separate bundle altogether.
