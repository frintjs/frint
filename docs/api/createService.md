# createService

Function for genering a new Service class.

## Usage

```js
// ./services/MyServiceName.js
import { createService } from 'frint';

export default createService({
  myMethod() {
    return 'something';
  }
});
```

### Initialization

In case you want to perform some operations when initializing the service,
you can use the lifecycle method `initialize()`.

```js
// ./services/MyServiceName.js
import { createService } from 'frint';

export default createService({
  initialize(options = {}) {
    // `options` contains all constructor options
    this.myProp = 'something';
  },
  myMethod() {
    return this.myProp;
  }
});
```
