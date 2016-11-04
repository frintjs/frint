/* eslint-disable no-console, no-underscore-dangle */
/* globals window */
import { Subject } from 'rxjs';
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import createAppendActionMiddleware from './middlewares/appendAction';
import Provider from './components/Provider';

class BaseApp {
  constructor(opts = {}) {
    this.options = {
      // primary info
      name: 'App',
      appId: null,
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
      factories: {},

      // lifecycle callbacks
      beforeMount: () => {},
      afterMount: () => {},
      beforeUnmount: () => {},

      // override
      ...opts
    };

    if (!this.options.appId) {
      throw new Error('Must provide `appId` in options');
    }

    if (!this.options.component) {
      throw new Error('Must provide `component` in options');
    }

    this.widgetsByRegion = {};

    if (typeof window.app !== 'undefined') {
      this.options.rootApp = window.app;
    }

    this.widgetsSubject$ = new Subject();

    this._createStore(
      this.options.reducer,
      this.options.initialState
    );

    this.readableApps = [];
  }

  getRootApp() {
    return this.options.rootApp;
  }

  getModel(modelName) { // eslint-disable-line
    // will be implemented below when extended
  }

  getService(serviceName) { // eslint-disable-line
    // will be implemented below when extended
  }

  getFactory(factoryName) {
    // TODO: optimize code to be more DRY
    const factories = this.getOption('factories');
    const FactoryClass = factories[factoryName];

    if (FactoryClass) {
      return new FactoryClass({
        app: this
      });
    }

    const rootApp = this.getRootApp();

    if (!rootApp) {
      return null;
    }

    const rootFactories = rootApp.getOption('factories');
    const RootFactoryClass = rootFactories[factoryName];

    if (RootFactoryClass) {
      return new RootFactoryClass({
        app: this
      });
    }

    return null;
  }

  createStore(rootReducer, initialState = {}) {
    console.warn('[DEPRECATED] `createStore` has been deprecated.');

    return this._createStore(rootReducer, initialState);
  }

  _createStore(rootReducer, initialState = {}) {
    const middlewares = [
      thunk.withExtraArgument({ app: this }),
      createAppendActionMiddleware({
        key: 'appName',
        value: this.getOption('name')
      })
    ];

    if (process.env.NODE_ENV !== 'production') {
      if (this.getOption('enableLogger') === true) {
        const createLogger = require('redux-logger'); // eslint-disable-line

        middlewares.push(createLogger());
      }
    }

    this.options.store = createStore(
      rootReducer,
      initialState,
      compose(
        applyMiddleware(...middlewares)
      )
    );

    return this.options.store;
  }

  getStore(appName = null) {
    console.warn('[DEPRECATED] `getStore` has been deprecated, use `getState$` instead.');

    return this._getStore(appName);
  }

  _getStore(appName = null) {
    if (!appName) {
      return this.getOption('store');
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
      return appsByName[appName]._getStore();
    }

    return null;
  }

  getState$(appName = null) {
    const subject$ = new Subject();
    const store = this._getStore(appName);

    if (store === null) {
      return subject$.startWith(null);
    }

    // @TODO: take care of this leak
    store.subscribe(() => {
      subject$.next(store.getState());
    });

    return subject$.startWith(store.getState());
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
    return this.options.beforeUnmount.bind(this)();
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

      // services
      _.each(this.options.services, (ServiceClass, serviceName) => {
        serviceInstances[serviceName] = new ServiceClass({
          app: this
        });
      });
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

    getService(serviceName) {
      if (serviceInstances[serviceName]) {
        return serviceInstances[serviceName];
      }

      const rootApp = this.getRootApp();

      if (!rootApp) {
        return null;
      }

      const serviceFromRoot = rootApp.getService(serviceName);

      if (serviceFromRoot) {
        return serviceFromRoot;
      }

      return null;
    }
  }

  return App;
}
