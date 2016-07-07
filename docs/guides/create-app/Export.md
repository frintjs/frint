# Exporting your App

We follow CommonJS everywhere, and expect you to expose your App's instance in root `index.js` file:

```js
// index.js
import MyApp from './app';

const myApp = new MyApp();

export default myApp;
```
