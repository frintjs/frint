import _ from 'lodash';

/**
 * Class definition of a Model.
 */
export default class Model {
  constructor(attributes) {
    this.attributes = attributes;
  }

  toJS() {
    return _.cloneDeep(this.attributes);
  }
}
