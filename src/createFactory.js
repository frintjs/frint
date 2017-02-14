// creation of Service and Factory classes are same as of this point
import createService from './createService';

export default function createFactory(extend = {}) {
  console.warn('[DEPRECATED] `createFactory` has been deprecated. Use `createClass` or direct ES6 classes instead.');

  const Service = createService(extend);

  class Factory extends Service {

  }

  return Factory;
}
