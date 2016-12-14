module.exports = {
  entry: __dirname + '/../src',
  output: {
    path: __dirname,
    filename: 'frint.js',
    libraryTarget: 'this',
    library: 'Frint'
  },
  externals: {
    'lodash': '_',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'rxjs': 'Rx',
  },
  module: {
    loaders: [
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
