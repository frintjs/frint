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
