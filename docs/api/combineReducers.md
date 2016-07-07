# combineReducers

For combining multiple reducer functions into one, which can later be passed to App class.

## Usage

```js
import { combineReducers } from 'frint';

import myCustomReducer from './reducers/myCustomReducer';
import anotherReducer from './reducers/anotherReducer';

const combined = combineReducers({
  myCustom: myCustomReducer,
  another: anotherReducer
});
```
