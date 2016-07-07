# createComponent

Creates Component classes with a `render` method, for returning JSX.

## Usage

```js
import { createComponent } from 'frint';

const MyComponent = createComponent({
  render() {
    return <p>Hello World</p>;
  }
});
```

## Lifecycle events

On the object passed to `createComponent`, certain lifecycle events can be defined. These will be called by the framework automatically.

```js
const MyComponent = createComponent({
  afterMount() {
    console.log('my component: afterMount');
  },

  beforeUnmount() {
    console.log('my component: beforeUnmount');
  },

  render() {
    ...
  }
}
```

### afterMount

Function that is called after your Component is mounted.

### beforeUnmount

Function that is called right before unmounting your Component.
