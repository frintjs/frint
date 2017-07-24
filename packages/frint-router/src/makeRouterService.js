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
          location,
          action,
        });
      });
    }

    getHistory$() {
      return this._history$;
    }

    getHistory() {
      return this._history;
    }

    getLocation$() {
      return this.getHistory$()
        .map(history => history.location);
    }

    getLocation() {
      return this.getHistory().location;
    }

    getMatch$(pattern, options = {}) {
      return this.getHistory$()
        .map((history) => {
          return this.getMatch(pattern, history, options);
        });
    }

    getMatch(pattern, history, opts = {}) { // eslint-disable-line
      const options = {
        exact: false,
        cache: true, // @TODO: implement later
        ...opts,
      };

      const matched = matchFromHistory(pattern, history, options);

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
