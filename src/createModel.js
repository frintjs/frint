import _ from 'lodash';

import BaseModel from './Model';

/**
 * Insantiate a new Model instance.
 *
 * @param  {Object} extend - model-specific attributes and methods
 * @return {Object}
 */
export default function createModel(extend = {}) {
  class Model extends BaseModel {
    constructor(...args) {
      super(...args);

      _.merge(this, extend);
    }
  }

  return Model;
}
