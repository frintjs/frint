const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const externals = require('frint-config').externals;

module.exports = {
  entry: {
    core: __dirname + '/core/index.js',
    'app-bar': __dirname + '/app-bar/index.js',
    'app-foo': __dirname + '/app-foo/index.js'

  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/build/js',
    filename: '[name].js'
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
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/layouts/index.ejs',
      filename: __dirname + '/build/index.html',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    })
  ],
  externals: Object.assign({}, externals, {
    'lodash': '_',
    'frint': 'Frint',
    'frint-model': 'FrintModel',
    'frint-react': 'FrintReact',
    'frint-store': 'FrintStore',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'rxjs': 'Rx'
  })
};
