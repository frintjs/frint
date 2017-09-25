import _ from 'lodash';

import BaseStore from './Store';

export default function createStore(options = {}) {
  if (options.thunkArgument) {
    console.warn('[DEPRECATED] Use `deps` instead of `thunkArgument` option');
    options.deps = options.thunkArgument;
  }

  class Store extends BaseStore {
    constructor(opts = {}) {
      super(_.merge(
        options,
        opts
      ));
    }
  }

  return Store;
}
