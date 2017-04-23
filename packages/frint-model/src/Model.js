import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

function Model(attributes) {
  this.attributes = Object.assign({}, attributes);
  this.$ = null;
}

function getFromAttributes(attributes, key) {
  if (typeof key === 'undefined') {
    return attributes;
  }

  if (typeof key !== 'string') {
    return undefined;
  }

  return _.get(attributes, key);
}

Model.prototype.get = function get(key) {
  return getFromAttributes(this.attributes, key);
};

Model.prototype.set = function set(key, value) {
  _.set(this.attributes, key, value);

  if (this.$) {
    this.$.next(this.attributes);
  }
};

Model.prototype.get$ = function get$(key) {
  if (!this.$) {
    this.$ = new BehaviorSubject(this.attributes);
  }

  return this.$
    .map((attributes) => {
      return getFromAttributes(attributes, key);
    });
};

Model.prototype.toJS = function toJS() {
  return _.cloneDeep(this.attributes);
};

export default Model;
