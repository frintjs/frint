var config = require('../../config');

module.exports = {
  entry: __dirname + '/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/../build/js',
    filename: 'widget-bar.js'
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
  },
  externals: config.externals,
  resolve: {
    extensions: [
      '',
      '.js'
    ]
  }
};
