import _ from 'lodash';

export default class Model {
  constructor(attributes) {
    this.attributes = {};
    Object.assign(this.attributes, attributes);
  }

  get(key) {
    if (typeof key !== 'string'
      || !Object.hasOwnProperty.call(this.attributes, key)) {
      return undefined;
    }
    return this.attributes[key];
  }

  toJS() {
    return _.cloneDeep(this.attributes);
  }
}
