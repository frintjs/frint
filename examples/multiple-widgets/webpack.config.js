module.exports = {
  entry: {
    core: __dirname + '/core/index.js',
    'app-bar': __dirname + '/app-bar/index.js',
    'app-foo': __dirname + '/app-foo/index.js',
    vendor: ['frint', 'frint-model', 'frint-react', 'frint-store', 'react', 'react-dom']
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
  }
};
