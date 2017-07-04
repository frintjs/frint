module.exports = {
  entry: {
    root: __dirname + '/root/index.js',
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
  plugins: [],
  externals: {
    'lodash': '_',
    'frint': 'Frint',
    'frint-react': 'FrintReact',
    'frint-store': 'FrintStore',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'rxjs': 'Rx'
  }
};
