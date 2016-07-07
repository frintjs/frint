# App

Creating a new App class is pretty straight forward. You would be required to create a new file at `app/index.js` with the following content:

```js
// app/index.js
import { createApp } from 'frint';

import RootComponent from '../components/Root'; // we still need to write this file

export default createApp({
  name: 'MyAppName',

  component: Root
});
```

Basically, you import the `createApp` function from our `frint` package, and define your App by giving it a name, and also the Component that it needs to render.
