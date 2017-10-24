/* eslint-disable func-names */
/**
 * Webpack's `externals` equivalent object,
 * listing dependencies that Frint packages use.
 */
import webpackRxJsExternals from './utils/webpackRxjsExternals';

export const rxjs = [webpackRxJsExternals()];

export const lodash = [
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
  }
];

// full imports
export const thirdParties = [{
  'lodash': {
    root: '_',
    commonjs: 'lodash',
    commonjs2: 'lodash',
    amd: 'lodash',
  },
}, {
  'rxjs': {
    root: 'Rx',
    commonjs: 'rxjs',
    commonjs2: 'rxjs',
    amd: 'rxjs',
  },
}, {
  'react': {
    root: 'React',
    commonjs: 'react',
    commonjs2: 'react',
    amd: 'react',
  },
}, {
  'react-dom': {
    root: 'ReactDOM',
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    amd: 'react-dom'
  }
}, {
  'prop-types': {
    root: 'PropTypes',
    commonjs: 'prop-types',
    commonjs2: 'prop-types',
    amd: 'prop-types',
  }
}];

export const frint = [{
  'frint': {
    root: 'Frint',
    commonjs: 'frint',
    commonjs2: 'frint',
    amd: 'frint'
  },
}, {
  'frint-store': {
    root: 'FrintStore',
    commonjs: 'frint-store',
    commonjs2: 'frint-store',
    amd: 'frint-store'
  },
}, {
  'frint-model': {
    root: 'FrintModel',
    commonjs: 'frint-model',
    commonjs2: 'frint-model',
    amd: 'frint-model'
  },
}, {
  'frint-data': {
    root: 'FrintData',
    commonjs: 'frint-data',
    commonjs2: 'frint-data',
    amd: 'frint-data'
  },
}, {
  'frint-react': {
    root: 'FrintReact',
    commonjs: 'frint-react',
    commonjs2: 'frint-react',
    amd: 'frint-react'
  },
}, {
  'frint-router': {
    root: 'FrintRouter',
    commonjs: 'frint-router',
    commonjs2: 'frint-router',
    amd: 'frint-router'
  },
}, {
  'frint-router-react': {
    root: 'FrintRouterReact',
    commonjs: 'frint-router-react',
    commonjs2: 'frint-router-react',
    amd: 'frint-router-react'
  }
}];

export default rxjs
  .concat(lodash)
  .concat(thirdParties);
