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
  ? 'frint-router-react.js'
  : 'frint-router-react.min.js';

module.exports = {
  entry: __dirname + '/src',
  output: {
    path: __dirname + '/dist',
    filename: filename,
    libraryTarget: 'umd',
    library: 'FrintRouterReact'
  },
  externals: externals.concat([
    {
      'frint-react': {
        root: 'FrintReact',
        commonjs: 'frint-react',
        commonjs2: 'frint-react',
        amd: 'frint-react',
      },
      'frint-router': {
        root: 'FrintRouter',
        commonjs: 'frint-router',
        commonjs2: 'frint-router',
        amd: 'frint-router',
      },
    },
  ]),
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
