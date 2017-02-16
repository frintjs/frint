import _ from 'lodash';

export default class Model {
  constructor(attributes) {
    this.attributes = Object.assign({}, attributes);
  }

  get(key) {
    if (typeof key !== 'string') {
      return undefined;
    }

    return _.get(this.attributes, key);
  }

  toJS() {
    return _.cloneDeep(this.attributes);
  }
}
