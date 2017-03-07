import _ from 'lodash';

import BaseModel from './Model';

export default function createModel(extend = {}) {
  class Model extends BaseModel {
    constructor(...args) {
      super(...args);

      _.merge(this, extend);

      if (typeof this.initialize === 'function') {
        this.initialize(...args);
      }
    }
  }

  return Model;
}
