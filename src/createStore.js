/* eslint-disable no-console */
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

class BaseStore {
  constructor(options = {}) {
    this.options = {
      initialState: null,
      thunkArgument: null,
      appendAction: false,
      reducer: state => state,
      enableLogger: true,
      ...options,
    };

    this.internalState$ = new BehaviorSubject(this.options.initialState)
      .scan(this.options.reducer);
    this.exposedState$ = new BehaviorSubject();

    this.cachedState = Object.assign({}, this.options.initialState);
    this.subscription = this.internalState$
      .startWith(this.options.cachedState)
      .subscribe((state) => {
        this.cachedState = state;
        this.exposedState$.next(state);
      });
  }

  getState$() {
    return this.exposedState$;
  }

  getState() {
    console.warn('[DEPRECATED] `Store.getState` has been deprecated, and kept for consistency purpose only with v0.x');

    return this.cachedState;
  }

  dispatch(action) {
    if (typeof action === 'function') {
      return this.dispatch(
        action(
          this.dispatch,
          this.getState,
          this.options.thunkArgument
        )
      );
    }

    const payload = (
      this.options.appendAction &&
      _.isPlainObject(this.options.appendAction)
    )
      ? { ...this.options.appendAction, ...action }
      : action;

    return this.internalState$.next(payload);
  }

  subscribe(callback) {
    console.warn('[DEPRECATED] `Store.subscribe` has been deprecated, and kept for consistency purpose only with v0.x');

    const store = this;

    const subscription = this.getState$()
      .subscribe((state) => {
        callback(state);
      });

    return function () {
      subscription.unsubscribe();
    }
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

export default function createStore(options = {}) {
  class Store extends BaseStore {
    constructor(opts = {}) {
      super(_.merge(
        options,
        opts
      ));
    }
  }

  return Store;
}
