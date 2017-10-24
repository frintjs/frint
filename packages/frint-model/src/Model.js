import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map as map$ } from 'rxjs/operators/map';

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

  return lodashGet(attributes, key);
}

Model.prototype.get = function get(key) {
  return getFromAttributes(this.attributes, key);
};

Model.prototype.set = function set(key, value) {
  lodashSet(this.attributes, key, value);

  if (this.$) {
    this.$.next(this.attributes);
  }
};

Model.prototype.get$ = function get$(key) {
  if (!this.$) {
    this.$ = new BehaviorSubject(this.attributes);
  }

  return this.$
    .pipe(map$((attributes) => {
      return getFromAttributes(attributes, key);
    }));
};

Model.prototype.toJS = function toJS() {
  return cloneDeep(this.attributes);
};

export default Model;
