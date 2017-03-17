import _ from 'lodash';

// TODO: this needs to be imported from 'ModelPlugin'
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
