import createService from './createService';

/**
 * Returns a new instance of the factory.
 * Creation of Service and Factory classes are same as of this point.
 * Each time a factory is called, a new instance is craeted;
 * while Services always returns the same instance.
 *
 * @param  {Object} extend [description]
 * @return {[type]}        [description]
 */
export default function createFactory(extend = {}) {
  // create a new instance every time
  const Service = createService(extend);

  class Factory extends Service {

  }

  return Factory;
}
