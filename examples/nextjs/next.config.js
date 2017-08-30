module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js)$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: [
          'travix'
        ]
      }
    });

    // config.externals = {
    //   'lodash': '_',
    //   'frint': 'Frint',
    //   'frint-react': 'FrintReact',
    //   'frint-store': 'FrintStore',
    //   'react': 'React',
    //   'react-dom': 'ReactDOM',
    //   'rxjs': 'Rx'
    // };

    return config;
  }
};
