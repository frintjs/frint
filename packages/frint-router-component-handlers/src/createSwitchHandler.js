import { composeHandlers } from 'frint-component-utils';

const SwitchHandler = {
  _routerSubscription: null,

  getInitialData() {
    return {
      history: null
    };
  },

  beforeMount() {
    this._subscribeToRouter();
  },

  beforeDestroy() {
    this._unsubscribeFromRouter();
  },

  getMatch(path, exact) {
    return this._getRouter()
      .getMatch(path, this.getData('history'), { exact });
  },

  _getRouter() {
    return this.app.get('router');
  },

  _subscribeToRouter() {
    this._routerSubscription = this._getRouter()
      .getHistory$()
      .subscribe((history) => {
        this.setData('history', history);
      });
  },

  _unsubscribeFromRouter() {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
      this._routerSubscription = null;
    }
  },
};

export default function createSwitchHandler(ComponentHandler, app, component) {
  return composeHandlers(
    SwitchHandler,
    ComponentHandler,
    {
      app,
      component
    },
  );
}
