import _ from 'lodash';

export default class Model {
  constructor(attributes) {
    this.attributes = attributes;
  }

  toJS() {
    return _.cloneDeep(this.attributes);
  }
}
