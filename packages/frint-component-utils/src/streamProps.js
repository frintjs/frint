import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { of as of$ } from 'rxjs/observable/of';
import { merge as merge$ } from 'rxjs/observable/merge';
import { concatMap as concatMap$ } from 'rxjs/operator/concatMap';
import { scan as scan$ } from 'rxjs/operator/scan';

import isObservable from './isObservable';

class Streamer {
  constructor(defaults = {}) {
    this._observables = [
      of$(defaults),
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
    this._push(of$(object));

    return this;
  }

  setObservable(object$, ...mappers) {
    let mappedObject$ = object$;

    mappers.forEach((mapperFn) => {
      mappedObject$ = mappedObject$
        ::concatMap$((object) => {
          const result = mapperFn(object);

          if (isObservable(result)) {
            return result;
          }

          return of$(result);
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

    this._push(of$(object));

    return this;
  }

  get$() {
    return merge$(...this._observables)
      ::scan$((props, emitted) => {
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
