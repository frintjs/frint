import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import pathToRegexp from 'path-to-regexp';

export default makeRouterService(createHistory) {
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
    }

    getHistory$() {
      return this._history$;
    }

    getMatch$(path) {
      return this.getHistory$()
        .map((history) => {
          let keys = [];
          const re = pathToRegexp(path, keys);
          const matched = re.exec(history.location.pathname);

          const keyNames = keys.map(k => k.name);

          if (!matched) {
            return null;
          }

          const keyValues = _.tail(matched);

          return {
            keys,
            matched,
            params: _.zipObject(keyNames, keyValues),
          };
        });
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
