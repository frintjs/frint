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

### Dynamically access attributes

If you just simply want to access attributes stored in your model class, you can use the accessor method `get(attribute)`, where `attribute` is the path in the attribute object.  For instance:

```js
// ./models/Address.js
import { createModel } from 'frint';

export default createModel();

// usage
import Address from './models/Address.js';

const address = new Address({
  name: 'Milliways',
  location: {
    object: 'fragments of a ruined planet',
    place: 'at the end of time and matter',
    coordinates: {
      long: '∞',
      lat: '∞',
    },
  },
});

const place = address.get('location.place'); // at the end of time and matter
```
