const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const { CommonsChunkPlugin } = webpack.optimize;

module.exports = {
  entry: {
    vendors: [
      'frint',
      'frint-model',
      'frint-react',
      'frint-store',
      'react',
      'react-dom',
      'rxjs'
    ],
    core: path.join(__dirname, '/core/index.js'),
    'app-color': path.join(__dirname, '/app-color/index.js'),
    'app-counter': path.join(__dirname, '/app-counter/index.js'),
    'app-reversed': path.join(__dirname, '/app-reversed/index.js'),
    'app-todos': path.join(__dirname, '/app-todos/index.js')
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/build/js'),
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
    new CommonsChunkPlugin({
      name: 'vendors',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/layouts/index.ejs'),
      filename: path.join(__dirname, '/build/index.html'),
      chunksSortMode({ names }) {
        return names[0] === 'vendors' ? -1 : 1;
      }
    })
  ]
};
