import merge from 'lodash/merge';

// TODO: this needs to be imported from 'ModelPlugin'
import BaseModel from './Model';

export default function createModel(extend = {}) {
  console.warn('[DEPRECATED] frint-model has been deprecated, use frint-data instead');

  class Model extends BaseModel {
    constructor(...args) {
      super(...args);

      if (typeof this.initialize === 'function') {
        this.initialize(...args);
      }
    }
  }

  merge(Model.prototype, extend);

  return Model;
}
