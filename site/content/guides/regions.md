---
title: Regions
sidebarPartial: guidesSidebar
---

# Regions

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->

- [What is a Region?](#what-is-a-region)
- [Register Widgets with region name](#register-widgets-with-region-name)
- [Defining a Region](#defining-a-region)

<!-- /MarkdownTOC -->

## What is a Region?

By now, we have discussed how:

* Core Apps are created
* Creating and registering Widgets
* Rendering Core Apps

But we didn't talk about rendering the Widgets yet.

We do that via `Region` component, that is shipped with `frint-react` package.

## Register Widgets with region name

When registering widgets, you can pass extra information like the Region where you want it to be mounted on to:

```js
window.app = new CoreApp();

window.app.registerWidget(Widget, {
  regions: [
    'sidebar'
  ]
});
```

We just registered a Widget in our Core App, and provided enough information to let it know that we want our Widget to be mounted in a region somewhere which happens to have a name `sidebar`.

But the `sidebar` Region does not exist yet. Let's define it next.

## Defining a Region

Since `Region` is a component itself, we can implement it in the root component of our Core App:

```js
import React, { Component } from 'react';
import { Region } from 'frint-react';

class RootComponentOfCoreApp extends Component {
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

All we did from our Core App is just to define a Region, and give it a name `sidebar`.

Now whenever a Widget becomes available, and it happens to have a target region of the same name, it would get rendered within that specific Region.
