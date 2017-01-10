/* eslint-disable no-console, no-underscore-dangle */
/* globals window */
import { Subject } from 'rxjs';
import _ from 'lodash';

import createStore from './createStore';
import Provider from './components/Provider';
import h from './h';

import mergeServicesAndFactories from './_mergeServicesAndFactories'; // TODO: get rid of this when factories are removed

class BaseApp {
  constructor(opts = {}) {
    this.options = {
      // primary info
      name: null,
      devSessionId: null,
      rootApp: null,
      version: 1,

      // the root component to render
      component: null,

      // list of Model instances
      models: {},

      // store
      store: null,
      reducer: (state = {}) => state,
      initialState: {},
      enableLogger: true,

      services: {},

      // lifecycle callbacks
      beforeMount: () => {},
      afterMount: () => {},
      beforeUnmount: () => {},

      // override
      ...opts
    };

    // TODO: get rid of this when factories are removed
    mergeServicesAndFactories(this.options);

    // errors
    if (!this.options.name) {
      throw new Error('Must provide `name` in options');
    }

    if (!this.options.component) {
      throw new Error('Must provide `component` in options');
    }

    // widgets
    this.widgetsByRegion = {};

    if (
      typeof window !== 'undefined' &&
      typeof window.app !== 'undefined'
    ) {
      this.options.rootApp = window.app;
    }

    this.widgetsSubject$ = new Subject();

    // store
    this._createStore(
      this.options.reducer,
      this.options.initialState
    );

    this.readableApps = [];
  }

  getRootApp() {
    return this.options.rootApp;
  }

  createStore(rootReducer, initialState = {}) {
    console.warn('[DEPRECATED] `createStore` has been deprecated.');

    return this._createStore(rootReducer, initialState);
  }

  _createStore(rootReducer, initialState = {}) {
    const Store = createStore({
      reducer: rootReducer,
      initialState,
      enableLogger: this.options.enableLogger,
      thunkArgument: { app: this },
      appendAction: {
        appName: this.options.name,
      },
    });
    this.options.store = new Store();

    return this.options.store;
  }

  getStore(appName = null) {
    console.warn('[DEPRECATED] `getStore` has been deprecated, use `getState$` instead.');

    return this._getStore(appName);
  }

  _getAppByName(appName = null) {
    if (!appName) {
      return this;
    }

    const rootApp = this.getRootApp();
    const widgetsByRegion = rootApp
      ? rootApp.widgetsByRegion
      : this.widgetsByRegion;

    const appsByName = _.reduce(widgetsByRegion, (result, value) => {
      value.forEach((app) => {
        const name = app.getOption('name');
        result[name] = app;
      });

      return result;
    }, {});

    // @TODO: check for permissions
    if (typeof appsByName[appName] !== 'undefined') {
      return appsByName[appName];
    }

    return null;
  }

  _getStore(appName = null) {
    const app = this._getAppByName(appName);

    if (!app) {
      return null;
    }

    return app.getOption('store');
  }

  getState$(appName = null) {
    const app = this._getAppByName(appName);

    if (!app) {
      return null;
    }

    return app.options.store.getState$();
  }

  dispatch(action) {
    return this._getStore().dispatch(action);
  }

  getOption(key) {
    return this.options[key];
  }

  registerWidget(widgetApp, regionName) {
    if (!Array.isArray(this.widgetsByRegion[regionName])) {
      this.widgetsByRegion[regionName] = [];
    }

    this.widgetsByRegion[regionName].push(widgetApp);

    return this.widgetsSubject$.next(this.widgetsByRegion);
  }

  beforeMount() {
    return this.options.beforeMount.bind(this)();
  }

  render() {
    const Component = this.getOption('component');
    const self = this;

    return () => (
      <Provider app={self}>
        <Component />
      </Provider>
    );
  }

  afterMount() {
    return this.options.afterMount.bind(this)();
  }

  beforeUnmount() {
    const output = this.options.beforeUnmount.bind(this)();
    this.options.store.destroy();

    return output;
  }

  /**
   * Alternative to Core.registerWidget(),
   * by doing Widget.setRegion()
   */
  setRegion(regionName) {
    return this.setRegions([regionName]);
  }

  setRegions(regionNames) {
    const rootApp = this.getRootApp();

    if (!rootApp) {
      throw new Error('No root app instance available, so cannot set region.');
    }

    return regionNames.forEach((regionName) => {
      return rootApp.registerWidget(this, regionName);
    });
  }

  getWidgets(regionName = null) {
    if (!regionName) {
      return this.widgetsByRegion;
    }

    const list = this.widgetsByRegion[regionName];

    if (!list) {
      return [];
    }

    return list;
  }

  observeWidgets() {
    console.warn('[DEPRECATED] `observeWidgets` is deprecated, use `observeWidgets$` instead.');

    return this.observeWidgets$();
  }

  observeWidgets$() {
    return this.widgetsSubject$.startWith(
      this.getWidgets()
    );
  }

  readStateFrom(appNames = []) {
    this.readableApps = appNames;
  }
}

export default function createApp(options = {}) {
  const modelRegistry = {};
  const serviceInstances = {};

  // TODO: get rid of ths when factories are removed
  mergeServicesAndFactories(options);

  class App extends BaseApp {
    constructor(opts = {}) {
      super(_.merge(
        options,
        opts
      ));

      // models
      _.each(this.options.models, (ModelClass, modelName) => {
        if (typeof ModelClass !== 'function') {
          throw new Error(`Expected model class '${modelName}' to be a valid Model class`);
        }

        modelRegistry[modelName] = _.memoize(() => {
          const attrs = this.options.modelAttributes[modelName] || {};
          return new ModelClass(attrs);
        }, () => modelName);
      });
    }

    getService(serviceName, rootLookup = true, app = this) {
      const services = this.getOption('services');
      let ServiceClass = services[serviceName];
      if (!ServiceClass && rootLookup) {
        const rootApp = this.getRootApp();
        if (rootApp) {
          return rootApp.getService(serviceName, false, this);
        }
      }

      if (!ServiceClass) { return null; }

      const p = ServiceClass.prototype;
      const scopedByApp = typeof p.initialize === 'function' && p.initialize.length === 1;
      const cacheKey = scopedByApp ? `${app.getOption('name')}/${serviceName}` : serviceName;

      let instance = serviceInstances[cacheKey];
      if (!instance) {
        instance = serviceInstances[cacheKey] = new ServiceClass({ app });
      }

      return instance;
    }

    getFactory(factoryName) {
      console.warn('[DEPRECATED] `getFactory` has been deprecated, use `getService` instead.');
      return this.getService(factoryName);
    }

    getModel(modelName) {
      if (modelName in modelRegistry) {
        return modelRegistry[modelName]();
      }
      const rootApp = this.getRootApp();
      if (rootApp) {
        return rootApp.getModel(modelName);
      }
      return null;
    }
  }

  return App;
}
