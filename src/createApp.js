import { Subject } from 'rxjs';
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import _ from 'lodash';

import createAppendActionMiddleware from './middlewares/appendAction';
import Provider from './components/Provider';

/**
 * Class definition of an app.
 */
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

    this.widgetsSubject = new Subject();

    this.createStore(
      this.options.reducer,
      this.options.initialState
    );

    this.readableApps = [];
  }

  /**
   * Return the rootApp instance.
   *
   * @return {Object} - The root app instance
   */
  getRootApp() {
    return this.options.rootApp;
  }

  /**
   * Return model scoped to one single app instance.
   * Implemented when this baseApp class is extended.
   */
  getModel(modelName) { // eslint-disable-line
    // will be implemented below when extended
  }

  /**
   * Returns service scoped to one single root app instance.
   * Implemented when this baseApp class is extended.
   */
  getService(serviceName) { // eslint-disable-line
    // will be implemented below when extended
  }

  /**
   * Returns new instance of a factory, scoped to the current app, if existing.
   * Otherwise return factory from the root app.
   *
   * @param  {String} factoryName
   * @return {Object} new instance of the factory
   */
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

  /**
   * Creates a store scoped to one single app instance.
   *
   * @param  {Object} rootReducer  - reducer that returns a single state object
   * @param  {Object} initialState - initial shape of the state object
   * @return {Object}
   */
  createStore(rootReducer, initialState = {}) {
    this.options.store = createStore(
      rootReducer,
      initialState,
      compose(
        applyMiddleware(
          thunk.withExtraArgument({ app: this }),
          createAppendActionMiddleware({
            key: 'appName',
            value: this.getOption('name')
          }),
          createLogger() // @TODO: load it in DEV environment only
        )
      )
    );

    return this.options.store;
  }

  /**
   * Returns instance of the store, scoped to one single app instance.
   *
   * @param  {String} appName
   * @return {Object}
   */
  getStore(appName = null) {
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
      return appsByName[appName].getStore();
    }

    return null;
  }

  /**
   * Utility function that returns properties from options.
   *
   * @param  {String} key - any key of the options object
   * @return {Object}
   */
  getOption(key) {
    return this.options[key];
  }

  /**
   * Adding widgets to a Region, for rendering widgets in the designated area.
   *
   * @param  {Object} WidgetApp  - widget to be registered
   * @param  {String} regionName - region to be registered to
   * @return {Object}            - Subject appended with list of widgets
   */
  registerWidget(WidgetApp, regionName) {
    if (!Array.isArray(this.widgetsByRegion[regionName])) {
      this.widgetsByRegion[regionName] = [];
    }

    this.widgetsByRegion[regionName].push(WidgetApp);

    return this.widgetsSubject.next(this.widgetsByRegion);
  }

  /**
   * Calling the beforeMount lifecycle method binded to the correct app instance context.
   *
   * @return {Function}
   */
  beforeMount() {
    return this.options.beforeMount.bind(this)();
  }

  /**
   * Renders a scoped component with it's own store.
   *
   * @return {JSX}
   */
  render() {
    const Component = this.getOption('component');

    const store = this.getStore();
    const self = this;

    return () => (
      <Provider app={self} store={store}>
        <Component />
      </Provider>
    );
  }

  /**
   * Calling the afterMount lifecycle method, binded to the correct app instance context.
   *
   * @return {Function}
   */
  afterMount() {
    return this.options.afterMount.bind(this)();
  }


  /**
   * Calling the beforeUnmount lifecycle method, binded to the correct app instance context.
   *
   * @return {Function}
   */
  beforeUnmount() {
    return this.options.beforeUnmount.bind(this)();
  }

  /**
   * Registering the app to the specified Region.
   * When this method is called, the specified Region will be re-rendered, loading the child app.
   *
   * This is an alternative method to CoreApp.registerWidget(),
   * by doing childApp.setRegion()
   */
  setRegion(regionName) {
    const rootApp = this.getRootApp();

    if (!rootApp) {
      throw new Error('No root app instance available, so cannot set region.');
    }

    return rootApp.registerWidget(this, regionName);
  }

  /**
   * Return array of widgets in the specified region, if any.
   * If none is specified, return array of widgets of the root app.
   *
   * @param  {String} regionName
   * @return {Array}
   */
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

  /**
   * Prepends the list of widgets to the widgets Subject.
   *
   * @return {Observable} - the sequence prepended with the widget list
   */
  observeWidgets() {
    return this.widgetsSubject.startWith(
      this.getWidgets()
    );
  }

  /**
   * Exposing list of appNames to this.readableApps.
   *
   * @param  {Array}  appNames - list of exposed apps
   * @return {Null}
   */
  readStateFrom(appNames = []) {
    this.readableApps = appNames;
  }
}

/**
 * Creates an app instance.
 *
 * @param  {Object} options - object of app-specific configurations
 * @return {Object}         - new app instance
 */
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
          throw new Error(`Expected model class '${modelName}' to be a valid Model class. Its type should be 'function'.`);
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

    /**
     * Return instance of model.
     *
     * @param  {String} modelName - name of model requested
     * @return {Function}
     */
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

    /**
     * Return the same service instance.
     *
     * @param  {String} serviceName - name of service requested
     * @return {Function}
     */
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
