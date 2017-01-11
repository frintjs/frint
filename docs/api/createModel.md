# createModel

Function for generating custom Model classes.

## Usage

```js
import { createModel } from 'frint';

const Shirt = createModel({
  getColor: function () {
    return this.attributes.color;
  },

  getSize: function () {
    return this.attributes.size;
  }
});

const shirt = new MyModel({
  color: 'blue',
  size: 'medium'
});

const color = shirt.getColor(); // blue
```

### Initialization

In case you want to perform some operations when initializing the model,
you can use the lifecycle method `initialize()`.

```js
// ./models/MyModelName.js
import { createModel } from 'frint';

export default createModel({
  initialize(attributes = {}) {
    // `attributes` contains all constructor options
  }
});
```
