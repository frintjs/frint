# Exporting your App

We follow CommonJS everywhere, and expect you to expose your App's instance in root `index.js` file:

We have previously our own app in `app/index.js`. In case you've forgotten, this is what we have done.
```js
// app/index.js
import { createApp } from 'frint';

// defines the <divs> to be rendered on the front-end
import RootComponent from '../components/Root';

// extending the app class to create your own app
export default createApp({
  name: 'MyAppName',

  component: Root
});
```

Now we need to insantiate a new instance of our shiny new app.
```js
// index.js
// importing our custom app class
import MyApp from './app';

// instantiate a new instance of the app
const myApp = new MyApp();

// expose the app
export default myApp;
```
Now we have exported a new instance of our app, and we are almost ready to go!
