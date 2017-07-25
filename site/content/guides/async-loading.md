---
title: Asynchronous loading of apps
sidebarPartial: guidesSidebar
---

# Asynchronous loading of apps

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [Why should you load apps asyncrounously?](#why-should-you-load-apps-asyncrounously)
- [How can we solve this?](#how-can-we-solve-this)

<!-- /MarkdownTOC -->

## Why should you load apps asyncrounously?

When performance is crucial, a common pattern for speeding up page loading is adding the
`async` attribute to a html document script tags, this allows the browser to continue parsing the html without stopping, waiting for the script to completely download, parse and run. This comes with a downside, which is that the scripts being referenced in the html document are not guaranteed to run in order.

## How can we solve this?

To workaround the run-order problem, we can use a technique popularized by the
Google Analytics tracking snippet. The technique works by creating a global array container
where any app will register to, until the moment the main root application loads.


```js
// In Root App's index.js
import App from './App';
const apps = window.app || [];
const app = window.app = new App();
app.push = options => app.registerApp(...options);
apps.forEach(app.push);
```

```js
// In Child App's index.js
import ChildApp from './ChildApp';
(window.app = window.app || []).push([ChildApp, {
  regions: ['main']
}]);
```

In practice this means that it doesn't matter if child app script tag is defined before
or after our root app:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script async src="./ChildApp.js"></script>
    <script async src="./RootApp.js"></script>
  </body>
</html>
```
