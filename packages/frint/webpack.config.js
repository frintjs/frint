var webpack = require('webpack');
var externals = require('frint-config').externals;

var minify = process.env.DIST_MIN;
var plugins = !minify
  ? []
  : [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      },
    }),
  ];
var filename = !minify
  ? 'frint.js'
  : 'frint.min.js';

module.exports = {
  plugins: plugins,
  target: 'web',
  entry: __dirname + '/src/index.ts',
  externals: externals,
  output: {
    path: __dirname + '/dist',
    filename: filename,
    libraryTarget: 'umd',
    library: 'Frint',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'ts-loader'
        }
      ]
    }]
  }
};
