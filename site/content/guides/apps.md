---
title: Apps
sidebarPartial: guidesSidebar
---

# Apps

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [What is an App?](#what-is-an-app)
- [How to create an App?](#how-to-create-an-app)
- [Core Apps](#core-apps)
- [Widgets](#widgets)

<!-- /MarkdownTOC -->

## What is an App?

Everything in Frint is wrapped inside an App. They contain all the bits and pieces in the form of [providers](../providers).

An App can be of two types:

* **Core**: The root app.
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

## Core Apps

In any page at any given moment, there can be only one Core App.

Let's create one:

```js
import { createApp } from 'frint';

const CoreApp = createApp({
  name: 'MyCoreApp'
});
```

Now it can be instantiated:

```js
window.app = new CoreApp();
```

## Widgets

Widgets are apps that get registered to the Core App.

Widgets can be created in the same way as Core Apps are created:

```js
import { createApp } from 'frint';

const Widget = createApp({
  name: 'MyWidget'
});
```

Now unlike Core Apps, Widgets are not instantiated manually. They are registered to Core Apps instead:

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
