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
      console: console,
      ...options,
    };

    this.internalState$ = new BehaviorSubject(this.options.initialState)
      .scan((previousState, action) => {
        let updatedState;
        const d = new Date();
        const prettyDate = [
          _.padStart(d.getHours(), 2, 0),
          ':',
          _.padStart(d.getMinutes(), 2, 0),
          ':',
          _.padStart(d.getSeconds(), 2, 0),
          '.',
          _.padStart(d.getMilliseconds(), 3, 0)
        ].join('');

        try {
          updatedState = this.options.reducer(previousState, action);
        } catch (error) {
          if (action && action.type) {
            this.options.console.error(`Error processing @ ${prettyDate} ${action.type}:`);
          }
          this.options.console.error(error);

          return previousState;
        }

        // logger in non-production mode only
        if (process.env.NODE_ENV !== 'production') {
          if (this.options.enableLogger === true) {
            const groupName = `action @ ${prettyDate} ${action.type}`;

            if (typeof this.options.console.group === 'function') {
              this.options.console.group(groupName);
            }

            this.options.console.log('%cprevious state', 'color: #9e9e9e; font-weight: bold;', previousState);
            this.options.console.log('%caction', 'color: #33c3f0; font-weight: bold;', action);
            this.options.console.log('%ccurrent state', 'color: #4cAf50; font-weight: bold;', updatedState);

            if (typeof this.options.console.groupEnd === 'function') {
              this.options.console.groupEnd();
            }
          }
        }

        return updatedState;
      });
    this.exposedState$ = new BehaviorSubject();

    this.cachedState = Object.assign({}, this.options.initialState);
    this.subscription = this.internalState$
      .subscribe((state) => {
        this.cachedState = state;
        this.exposedState$.next(state);
      });

    this.dispatch({ type: '__FRINT_INIT__' });
  }

  getState$() {
    return this.exposedState$;
  }

  getState = () => {
    return this.cachedState;
  }

  dispatch = (action) => {
    if (typeof action === 'function') {
      return action(
        this.dispatch,
        this.getState,
        this.options.thunkArgument
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
    this.options.console.warn('[DEPRECATED] `Store.subscribe` has been deprecated, and kept for consistency purpose only with v0.x');

    const subscription = this.getState$()
      .subscribe((state) => {
        callback(state);
      });

    return function unsubscribe() {
      subscription.unsubscribe();
    };
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
