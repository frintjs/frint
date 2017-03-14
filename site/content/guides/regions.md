---
title: Regions
sidebarPartial: guidesSidebar
---

# Regions

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [What is a Region?](#what-is-a-region)
- [Illustration](#illustration)
- [Register Widgets with region name](#register-widgets-with-region-name)
- [Defining a Region](#defining-a-region)

<!-- /MarkdownTOC -->

## What is a Region?

By now, we have discussed how:

* Root Apps are created
* Creating and registering Widgets
* Rendering Root Apps

But we didn't talk about rendering the Widgets yet.

We do that via `Region` component, that is shipped with `frint-react` package.


## Illustration

![region diagram](/img/frint-region-diagram.png)

Illustration of a root app, defining a region, where multiple widgets get loaded.

We will see some code examples below.

## Register Widgets with region name

When registering widgets, you can pass extra information like the Region where you want it to be mounted on to:

```js
window.app = new App(); // root app

window.app.registerWidget(Widget, {
  regions: [
    'sidebar'
  ]
});
```

We just registered a Widget in our Root App, and provided enough information to let it know that we want our Widget to be mounted in a region somewhere which happens to have a name `sidebar`.

But the `sidebar` Region does not exist yet. Let's define it next.

## Defining a Region

Since `Region` is a component itself, we can implement it in the root component of our Root App:

```js
import React, { Component } from 'react';
import { Region } from 'frint-react';

class RootComponentOfRootApp extends Component {
  render() {
    return (
      <div>
        <section>
          <p>Hello world</p>
        </section>

        <aside>
          <Region name="sidebar" />
        </aside>
      </div>
    );
  }
}
```

All we did from our Root App is just to define a Region, and give it a name `sidebar`.

Now whenever a Widget becomes available, and it happens to have a target region of the same name, it would get rendered within that specific Region.
