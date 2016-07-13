# App

Creating a new App class is pretty straight forward. You would be required to create a new file at `app/index.js` with the following content:

```js
// app/index.js
import { createApp } from 'frint';

// defines the <divs> to be rendered on the front-end
import RootComponent from '../components/Root';

// extending the app class to create your own app
export default createApp({
  // compulsory attributes
  name: 'MyAppName',

  component: Root
});
```

Basically, you import the `createApp` function from our `frint` package, and define your App by giving it a name, and also the Component that it needs to render. These are the required arguments to create an app.

This alone would be the bare-bone definition of the app, we shall create an instance of it later and render it to the front-end!
