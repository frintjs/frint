import _ from 'lodash';

import BaseStore from './Store';

export default function createStore(options = {}) {
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
