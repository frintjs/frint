# Region

Region is a oberservable-ready Component, that is exposed for Core app's convenience.

When you embed this Component with a given `name`, any time other apps register themselves to that named region, they will appear inside that relevantly named Region.

## Example

```js
/** @jsx h */
import { createComponent, Region, h } from 'frint';

const MyComponent = createComponent({
  render() {
    return (
      <div>
        <p>Below is the sidebar region:</p>

        <Region name="sidebar" />
      </div>
    );
  }
});
```

Next time, when a new Widget gets loaded, and it calls `setRegion`:

```js
someChildApp.setRegion('sidebar');
```

...our Region defined in Core app's MyComponent would re-render accordingly.
