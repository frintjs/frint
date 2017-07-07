import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import pathToRegexp from 'path-to-regexp';

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

    getMatch$(path, exact, updateParams = false) {
      return this.getHistory$()
        .map((history) => {
          const checkPath = exact
            ? path
            : path + '*'; // @TODO: needs proper fix non `/` matches
          let keys = [];
          const re = pathToRegexp(checkPath, keys);
          const matched = re.exec(history.location.pathname);

          const keyNames = keys.map(k => k.name);

          if (!matched) {
            // if (updateParams) {
            //   this._unsetParams(keyNames);
            // }

            return null;
          }

          const keyValues = _.tail(matched);
          const params = _.zipObject(keyNames, keyValues);
          const allKeysAvailable = keyNames
            .filter(k => typeof k === 'string')
            .every(k => params[k]);

          if (!allKeysAvailable) {
            // if (updateParams) {
            //   this._unsetParams(keyNames);
            // }

            return null;
          }

          // if (updateParams) {
          //   this._setParams(params);
          // }

          const availableKeysLength = keyValues
            .filter(v => v && v.length > 0)
            .length;

          return {
            // path,
            url: exact // @TODO: make it readable
              ? matched[0]
              : matched[0]
                .split('/')
                .slice(0, matched[0].split('/').length - availableKeysLength)
                .join('/'), // @TODO: check URLs not starting with `/`
            // keys,
            // matched,
            params,
          };
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
