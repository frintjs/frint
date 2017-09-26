import merge from 'lodash/merge';

import BaseApp from './App';

export default function createApp(options = {}) {
  class App extends BaseApp {
    constructor(opts = {}) {
      super(merge(
        options,
        opts
      ));
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
