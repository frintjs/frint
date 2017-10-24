import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map as map$ } from 'rxjs/operators/map';

import matchFromHistory from './matchFromHistory';

export default function makeRouterService(createHistory) {
  class RouterService {
    constructor(options = {}) {
      const defaultOptions = {
        enableCache: true,
        cacheLimit: 10000,
      };
      this.options = {
        ...defaultOptions,
        ...options,
      };
      this._history = createHistory(options);

      this._history$ = new BehaviorSubject({
        length: this._history.length,
        location: this._history.location,
        action: this._history.action,
      });

      this._listener = this._history.listen((location, action) => {
        this._history$.next({
          length: this._history.length,
          location,
          action,
        });
      });

      this._cache = {};
      this._cacheCount = 0;
    }

    getHistory$() {
      return this._history$;
    }

    getHistory() {
      return this._history;
    }

    getLocation$() {
      return this.getHistory$()
        .pipe(map$(history => history.location));
    }

    getLocation() {
      return this.getHistory().location;
    }

    getMatch$(pattern, options = {}) {
      return this.getHistory$()
        .pipe(map$((history) => {
          return this.getMatch(pattern, history, options);
        }));
    }

    getMatch(pattern, history, opts = {}) { // eslint-disable-line
      const options = {
        exact: false,
        ...opts,
      };
      const cacheKey = `${pattern}|${history.location.pathname}|${options.exact}`;

      if (
        this.options.enableCache &&
        this._cache[cacheKey]
      ) {
        return this._cache[cacheKey];
      }

      const matched = matchFromHistory(pattern, history, options);

      if (
        this.options.enableCache &&
        this._cacheCount < this.options.cacheLimit
      ) {
        this._cache[cacheKey] = matched;
        this._cacheCount += 1;
      }

      return matched;
    }

    destroy() {
      this._listener();
      this._history$.complete();
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
