# h

Hyperscript for JSX.

## Usage

The `h` function just needs to exist in the same scope, wherever you are using JSX.

You can manually tell your transpiler (Babel in this example), which function to use at file-level:

```js
/** @jsx h */
import { createComponent, h } from 'frint';

const MyComponent = createComponent({
  render() {
    return (
      <p>Name is {this.prop.name}</p>
    );
  }
});
```

Or you can also set it up in your `.babelrc` file globally:

```
// .babelrc
{
  "presets": [
    "travix"
  ],
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "h"
    }]
  ]
}
```

In that case, you wouldn't need the extra `/** @jsx h */` comment block:

```js
import { createComponent, h } from 'frint';

const MyComponent = createComponent({
  render() {
    return (
      <p>Name is {this.prop.name}</p>
    );
  }
});
```
