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
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
          },
        ],
      }
    ]
  },
  plugins: [],
  externals: {
    'lodash': '_',
    'frint': 'Frint',
    'frint-react': 'FrintReact',
    'frint-store': 'FrintStore',
    'frint-router': 'FrintRouter',
    'frint-router/HashRouterService': 'FrintRouter.HashRouterService',
    'frint-router-react': 'FrintRouterReact',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'rxjs': 'Rx'
  }
};
