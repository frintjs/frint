import _ from 'lodash';
import { Observable } from 'rxjs';

import isObservable from './isObservable';

class Streamer {
  constructor(defaults = {}) {
    this._observables = [
      Observable.of(defaults),
    ];
  }

  _push(observable) {
    this._observables.push(observable);
  }

  set(value, ...args) {
    // (key, value)
    if (typeof value === 'string') {
      return this.setKey(value, args[0]);
    }

    // (plainObject)
    if (_.isPlainObject(value)) {
      return this.setPlainObject(value);
    }

    // (observable$, ...mapperFns)
    if (isObservable(value)) {
      return this.setObservable(value, ...args);
    }

    return this;
  }

  setKey(key, value) {
    this._push(Observable.of({
      [key]: value
    }));

    return this;
  }

  setPlainObject(object) {
    this._push(Observable.of(object));

    return this;
  }

  setObservable(object$, ...mappers) {
    let mappedObject$ = object$;

    mappers.forEach((mapperFn) => {
      mappedObject$ = mappedObject$
        .concatMap((object) => {
          const result = mapperFn(object);

          if (isObservable(result)) {
            return result;
          }

          return Observable.of(result);
        });
    });

    this._push(mappedObject$);

    return this;
  }

  setDispatch(actions, store) {
    const object = {};

    Object.keys(actions)
      .forEach((propKey) => {
        const actionFn = actions[propKey];

        object[propKey] = (...args) => {
          return store.dispatch(actionFn(...args));
        };
      });

    this._push(Observable.of(object));

    return this;
  }

  get$() {
    return Observable.merge(...this._observables)
      .scan((props, emitted) => {
        return {
          ...props,
          ...emitted,
        };
      });
  }
}

export default function streamProps(defaultProps = {}) {
  return new Streamer(defaultProps);
}
