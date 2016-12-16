# Component

Previously, we saw that App requires a Component for rendering. We will write our entry-level Component in `components/Root.js`:

```js
// components/Root.js
/** @jsx h */
import { createComponent, h } from 'frint';

export default createComponent({
  render() {
    return (
      <p>Hello World!</p>
    );
  }
});
```

If you have already configured your transpiler to point JSX pragma to frint's `h` function, then you don't need the comment block `/** @jsx h */`.
