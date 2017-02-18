import _ from 'lodash';

function Model(attributes) {
  this.attributes = Object.assign({}, attributes);
}

Model.prototype.get = function get(key) {
  if (typeof key !== 'string') {
    return undefined;
  }

  return _.get(this.attributes, key);
};

Model.prototype.toJS = function toJS() {
  return _.cloneDeep(this.attributes);
};

export default Model;
