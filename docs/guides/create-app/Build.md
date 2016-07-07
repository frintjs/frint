# Build

We use Webpack for bundling Apps, and to do that, we require a `webpack.config.js` file in root directory:

```js
module.exports = {
  entry: __dirname + '/index.js',
  output: {
    path: '/path/to/write/to',
    filename: 'widget-my-app.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        loaders: [
          'babel'
        ]
      }
    ]
  }
};
```
