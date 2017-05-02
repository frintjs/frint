module.exports = {
  entry: {
    core: __dirname + '/core/index.js',
    vendor: ['frint', 'frint-react', 'react', 'react-dom', 'rxjs']
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
