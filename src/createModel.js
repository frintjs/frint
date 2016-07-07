import _ from 'lodash';

import BaseModel from './Model';

export default function createModel(extend = {}) {
  class Model extends BaseModel {
    constructor(...args) {
      super(...args);

      _.merge(this, extend);
    }
  }

  return Model;
}
