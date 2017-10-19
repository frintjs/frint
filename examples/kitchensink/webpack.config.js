const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('frint-config');

module.exports = {
  entry: {
    core: __dirname + '/core/index.js',
    'app-color': __dirname + '/app-color/index.js',
    'app-counter': __dirname + '/app-counter/index.js',
    'app-reversed': __dirname + '/app-reversed/index.js',
    'app-todos': __dirname + '/app-todos/index.js'
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/build/js',
    filename: '[name].js',
    libraryTarget: 'umd',
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
      chunksSortMode({ names }) {
        return names[0] === 'core' ? -1 : 1;
      }
    })
  ],
  externals: []
    .concat(config.rxjsExternals)
    .concat(config.lodashExternals)
    .concat(config.thirdPartyExternals)
    .concat(config.frintExternals),
};
