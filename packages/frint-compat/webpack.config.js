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
  externals: Object.assign({}, {
    'frint': 'Frint',
    'frint-model': 'FrintModel',
    'frint-react': 'FrintReact',
    'frint-store': 'FrintStore',
    'lodash': '_',
    'prop-types': 'PropTypes',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'rxjs': 'Rx',
  }, externals),
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
