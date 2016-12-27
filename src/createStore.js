/* eslint-disable no-console */
import _ from 'lodash';
import { Subject, BehaviorSubject } from 'rxjs';

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

    this.state$ = new BehaviorSubject(this.options.initialState) // @TODO: initial state needs to fire
      .scan(this.options.reducer);

    this.listeners = [];

    this.cachedState = Object.assign({}, this.options.initialState);
    this.subscription = this.state$
      .subscribe((state) => {
        this.cachedState = state;
        this.listeners.forEach(listener => listener(state));
      });
  }

  getState$() {
    const subject$ = new Subject();

    // @TODO: unlisten when Subject unsubscribes
    this.listeners.push(function (state) {
      subject$.next(state);
    });

    return subject$;
  }

  getState() {
    console.warn('[DEPRECATED] `getState` has been deprecated, and kept for consistency purpose only with v0.x');

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

    return this.state$.next(payload);
  }

  destroy() {
    this.listeners.forEach(function (unsubscribe) {
      if (typeof unsubscribe === 'function') {
        return unsubscribe();
      }
    });
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
