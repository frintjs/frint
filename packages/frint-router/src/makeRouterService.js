import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

import matchFromHistory from './matchFromHistory';

export default function makeRouterService(createHistory) {
  class RouterService {
    constructor(options = {}) {
      this.options = options;
      this._history = createHistory(options);

      this._history$ = new BehaviorSubject({
        length: this._history.length,
        location: this._history.location,
        action: this._history.action,
      });

      this._listener = this._history.listen((location, action) => {
        this._history$.next({
          length: this._history.length,
          location: this._history.location,
          action: this._history.action,
        });
      });

      this._params = {};
      this._params$ = new BehaviorSubject(this._params);
    }

    getHistory$() {
      return this._history$;
    }

    getMatch$(pattern, opts = {}) {
      const options = {
        exact: false,
        updateParams: false, // @TODO: implement later
        cache: true, // @TODO: implement later
        ...opts,
      };

      return this.getHistory$()
        .map((history) => {
          const matched = matchFromHistory(pattern, history, options);

          return matched;
        });
    }

    _unsetParams(names) {
      this._params = names.reduce((acc, (name) => {
        if (typeof acc[name] !== 'undefined') {
          delete acc[name];
        }

        return acc;
      }), this._params || {});

      this._params$.next(this._params);
    }

    _setParams(params) {
      this._params = Object.assign({}, this._params, params);

      this._params$.next(this._params);
    }

    getParams$() {
      return this._params$;
    }

    destroy() {
      this._listener();
    }

    go(n) {
      return this._history.go(n);
    }

    push(path, state) {
      return this._history.push(path, state);
    }

    replace(path, state) {
      return this._history.replace(path, state);
    }

    goBack() {
      return this._history.goBack();
    }

    goForward() {
      return this._history.goForward();
    }
  }

  return RouterService;
}
