# PropTypes

Same as [React.PropTypes](https://facebook.github.io/react/docs/reusable-components.html);

## Usage

```js
import { createComponent, PropTypes } from 'frint';

const MyComponent = createComponent({
  propTypes: {
    name: PropTypes.string.isRequired
  },

  render() {
    return (
      <p>Name is {this.props.name}</p>
    );
  }
});
```
