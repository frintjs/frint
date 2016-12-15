# Component

Component classes ready to be embedded as JSX for rendering.

## Usage

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

It is best practice to define `propTypes` while defining the Component too. You can read more about it in [PropTypes](./PropTypes.md) section.
