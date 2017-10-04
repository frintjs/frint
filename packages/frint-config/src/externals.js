/* eslint-disable func-names */
/**
 * Webpack's `externals` equivalent object,
 * listing dependencies that Frint packages use.
 */
import webpackRxjsExternals from 'webpack-rxjs-externals';

export default [
  // rxjs/*
  webpackRxjsExternals(),

  // lodash/*
  function (context, request, callback) {
    if (request.startsWith('lodash/')) {
      const subModule = request.split('/')[1];

      return callback(null, {
        root: ['_', subModule],
        commonjs: request,
        commonjs2: request,
        amd: request,
      });
    }

    return callback();
  },

  // full imports
  {
    'lodash': {
      root: '_',
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
    },
    'rxjs': {
      root: 'Rx',
      commonjs: 'rxjs',
      commonjs2: 'rxjs',
      amd: 'rxjs',
    },
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types',
    },
  },
];
