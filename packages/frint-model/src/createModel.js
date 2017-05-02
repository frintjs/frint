import _ from 'lodash';

// TODO: this needs to be imported from 'ModelPlugin'
import BaseModel from './Model';
import createSchema from './createSchema';

export default function createModel(extend = {}) {
  class Model extends BaseModel {
    constructor(...args) {
      super(...args);

      _.merge(this, extend);

      // If we have a schema defined, then apply it
      if (this.schema) {
        const sm = createSchema(this.schema);
        if (sm) { // If we have a valid schema
          this.applySchema(sm);
        }
      }

      if (typeof this.initialize === 'function') {
        this.initialize(...args);
      }
    }
  }

  return Model;
}
