import _ from 'lodash';

/**
 * Creating a service, binding all methods of the service to the app instance.
 *
 * @param  {Object} extend - object of function methods
 * @return {Function}
 */
export default function createService(extend = {}) {
  class Service {
    constructor(options = {}) {
      if (!options.app) {
        throw new Error('App instance not provided.');
      }

      this.app = options.app;

      _.merge(this, extend);

      // bind all methods to this app instance
      Object.keys(this)
        .filter((prop) => (this[prop] instanceof Function))
        .forEach((prop) => (this[prop] = this[prop].bind(this)));

      if (typeof this.initialize === 'function') {
        this.initialize();
      }
    }
  }

  return Service;
}
