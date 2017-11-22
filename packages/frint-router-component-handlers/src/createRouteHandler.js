import { composeHandlers } from 'frint-component-utils';

const RouteHandler = {
  _routerSubscription: null,
  _appInstance: null,

  getInitialData() {
    return {
      component: null,
      matched: null,
    };
  },

  beforeMount() {
    const props = this.getProps();
    this._calculateMatchedState(props);
    this._calculateComponentState(props);
  },

  propsChange(nextProps, pathChanged, exactChanged, appChanged) {
    this._calculateMatchedState(nextProps, pathChanged, exactChanged);
    this._calculateComponentState(nextProps, appChanged);
  },

  beforeDestroy() {
    this._unsubscribeFromRouter();
    this._destroyRouteApp();
  },

  _getRouter() {
    return this.app.get('router');
  },

  _calculateMatchedState(nextProps, pathChanged = false, exactChanged = false) {
    if (nextProps.computedMatch) {
      // in case it was subscribed before
      this._unsubscribeFromRouter();
    } else if (nextProps.path) {
      if (!this._routerSubscription || pathChanged || exactChanged) {
        this._unsubscribeFromRouter();

        this._routerSubscription = this._getRouter()
          .getMatch$(nextProps.path, {
            exact: nextProps.exact,
          })
          .subscribe((matched) => {
            this.setData('matched', matched);
          });
      }
    }
  },

  _calculateComponentState(nextProps, appChanged = false) {
    if (nextProps.render) {
      // render
      this.setData('component', null);
    } else if (nextProps.component) {
      // component
      this._destroyRouteApp();

      this.setData('component', nextProps.component);
    } else if (nextProps.app && (this._appInstance === null || appChanged)) {
      // app
      this._destroyRouteApp();

      const RouteApp = nextProps.app;

      this._appInstance = new RouteApp({
        parentApp: this.app,
      });

      this.setData('component', this.getMountableComponent(this._appInstance));
    }
  },

  _unsubscribeFromRouter() {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
      this._routerSubscription = null;
    }
  },

  _destroyRouteApp() {
    if (this._appInstance) {
      this._appInstance.beforeDestroy();
      this._appInstance = null;
    }
  }
};

export default function createRouteHandler(ComponentHandler, app, component) {
  if (typeof ComponentHandler.getMountableComponent !== 'function') {
    throw new Error('ComponentHandler must provide getMountableComponent() method');
  }

  return composeHandlers(
    RouteHandler,
    ComponentHandler,
    {
      app,
      component
    },
  );
}

