import _ from 'lodash';

export default function createService(extend = {}) {
  class Service {
    constructor(options = {}) {
      if (!options.app) {
        throw new Error('App instance not provided.');
      }

      _.merge(this, extend);

      Object.keys(this)
        .filter(prop => (this[prop] instanceof Function))
        .forEach(prop => (this[prop] = this[prop].bind(this)));

      if (typeof this.initialize === 'function') {
        this.initialize(options);
      }
    }
  }

  return Service;
}


export const ServiceWithDependency = createService({
  initialize(options) {
    this.app = options.app;
  },

  doSomething() {
    return this.app.getService('calculator').add(2, 2);
  }
});
