var config = require('../config');

module.exports = {
  entry: {
    core: __dirname + '/core/index.js',
    'app-bar': __dirname + '/app-bar/index.js',
    'app-foo': __dirname + '/app-foo/index.js'
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/build/js',
    filename: '[id].js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        query: {
          presets: [
            'travix'
          ]
        }
      }
    ]
  },
  externals: config.externals,
};
