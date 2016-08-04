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
