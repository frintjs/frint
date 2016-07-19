# Component

Previously, we saw that App requires a Component for rendering. We will write our entry-level Component in `components/Root.js`:

```js
// components/Root.js

import { createComponent } from 'frint';

export default createComponent({
  // required method
  render() {
    return (
      <p>Hello World!</p>
    );
  }
});
```

Component has to have a `render` method, which specifies the DOM elements to be shown on the webpage.

It is the same concept as React components, but with `frint`, this dependency is abstracted away from the developer. This has the advantage of being future-proof. In case of any changes in the back, like replacing ReactJS with some other library, that change would only needed to be implemented under the hood in `frint`, while the existing code-base would still be smooth and functional.
