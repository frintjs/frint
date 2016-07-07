# Model

The base model class, which custom models will extend from.

## Usage

```js
import { Model } from 'frint';

class Shirt extends Model {
  getColor() {
    return this.attributes.color;
  }

  getSize() {
    return this.attributes.size;
  }
}

const shirt = new MyModel({
  color: 'blue',
  size: 'medium'
});

const shirt = myModel.getColor(); // blue
```

## Properties

### Attributes

Holds the object passed to Model constructor.

## Methods

Methods are supposed to be implemented in custom Model classes.
