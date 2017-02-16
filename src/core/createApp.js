import _ from 'lodash';

import App from './App';

export default function createApp(options = {}) {
  class GeneratedApp extends App {
    constructor(opts = {}) {
      super(_.merge(
        options,
        opts
      ));
    }
  }

  if (typeof options.name !== 'undefined') {
    Object.defineProperty(GeneratedApp, 'frintAppName', {
      value: options.name,
      configurable: true,
    });
  }

  return GeneratedApp;
}
