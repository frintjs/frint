import _ from 'lodash';

import TypeError from './errors/Type';
import * as chainables from './ChainableTypes';

export default function chain(fn, omitChainables = []) {
  _.each(chainables, (chainObj, chainName) => {
    const chainFunc = chainObj.func;
    const chainIsFactory = chainObj.isFactory === true;

    if (omitChainables.indexOf(chainName) > -1) {
      return;
    }

    Object.defineProperty(fn, chainName, {
      get: function () {
        if (chainIsFactory) {
          return function (...args) {
            return chain(function (value) {
              let nextValue = chainFunc(value, ...args);

              return fn(nextValue);
            });
          };
        }

        return chain(function (value) {
          let nextValue = value;

          nextValue = chainFunc(nextValue);
          nextValue = fn(nextValue);

          return nextValue;
        }, omitChainables.concat([chainName]));
      }
    });
  });

  return fn;
}
