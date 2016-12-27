/* eslint-disable no-console */
import _ from 'lodash';
import { Subject } from 'rxjs';

class BaseStore {
  constructor(options = {}) {
    this.options = {
      initialState: null,
      thunkArgument: null,
      appendAction: false,
      reducer: state => state,
      enableLogger: true,
      cacheState: true,
      ...options,
    };

    this.dispatch$ = new Subject();
    this.state$ = this.dispatch$
      .startWith(this.options.initialState)
      .scan(this.options.reducer);

    // @TODO: remove this chunk (with `getState()`) in next breaking release
    if (this.options.cacheState) {
      this.cachedState = Object.assign({}, this.options.initialState);
      this.getState$()
        .subscribe((state) => {
          this.cachedState = state;
        });
    }
  }

  getState$() {
    return this.state$;
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

    return this.dispatch$.next(payload);
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
