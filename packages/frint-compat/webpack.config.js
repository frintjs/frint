var webpack = require('webpack');

var minify = process.env.DIST_MIN;
var plugins = !minify
  ? []
  : [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      }
    })
  ];
var filename = !minify
  ? 'frint-compat.js'
  : 'frint-compat.min.js';

module.exports = {
  entry: __dirname + '/src',
  output: {
    path: __dirname + '/dist',
    filename: filename,
    libraryTarget: 'this',
    library: 'FrintCompat'
  },
  externals: {
    'frint': 'Frint',
    'frint-model': 'FrintModel',
    'frint-react': 'FrintReact',
    'frint-store': 'FrintStore',
    'lodash': '_',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'rxjs': 'Rx',
  },
  target: 'web',
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            'travix'
          ]
        }
      }
    ]
  }
};
