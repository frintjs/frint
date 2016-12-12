var config = require('../../config');

module.exports = {
  entry: __dirname + '/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/../build/js',
    filename: 'core.js'
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
