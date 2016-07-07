// creation of Service and Factory classes are same as of this point
import createService from './createService';

export default function createFactory(extend = {}) {
  const Service = createService(extend);

  class Factory extends Service {

  }

  return Factory;
}
