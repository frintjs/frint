module.exports = {
  entry: {
    core: `${__dirname}/core/index.js`,
    'app-someform': `${__dirname}/app-someform/index.js`,
    vendor: ['frint', 'frint-model', 'frint-react', 'frint-store', 'react', 'react-dom', 'rxjs']
  },
  devtool: 'source-map',
  output: {
    path: `${__dirname}/build/js`,
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
