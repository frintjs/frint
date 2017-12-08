import merge from 'lodash/merge';

import BaseApp from './App';

function mergeOptions(createAppOptions, constructorOptions) {
  const mergedOptions = merge({}, createAppOptions, constructorOptions);

  // keep lifecycle methods from both
  // `createApp(options)` and `new App(options)`
  [
    'initialize',
    'beforeDestroy',
  ].forEach((cbName) => {
    if (
      typeof createAppOptions[cbName] === 'function' &&
      typeof constructorOptions[cbName] === 'function'
    ) {
      mergedOptions[cbName] = function lifecycleCb() {
        createAppOptions[cbName].call(this);
        constructorOptions[cbName].call(this);
      };
    }
  });

  return mergedOptions;
}

export default function createApp(options = {}) {
  class App extends BaseApp {
    constructor(opts = {}) {
      super(mergeOptions(options, opts));
    }
  }

  if (typeof options.name !== 'undefined') {
    Object.defineProperty(App, 'frintAppName', {
      value: options.name,
      configurable: true,
    });
  }

  return App;
}
