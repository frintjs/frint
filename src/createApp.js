/* eslint-disable no-console, no-underscore-dangle */
/* globals window */
import { BehaviorSubject, Observable } from 'rxjs';
import _ from 'lodash';
import { createContainer, resolveContainer } from 'diyai';

import Provider from './components/Provider';
import h from './h';
import createStore from './createStore';

function makeInstanceKey(region = null, regionKey = null, multi = false) {
  if (
    !multi ||
    (!region && !regionKey)
  ) {
    return 'default';
  }

  let key = '';

  if (region) {
    key = region;
  }

  if (regionKey) {
    key = `${region}_${regionKey}`;
  }

  return key;
}

class BaseApp {
  constructor(opts = {}) {
    this.options = {
      name: null,
      rootApp: null,
      providers: [],

      providerNames: {
        component: 'component',
        container: 'container',
        store: 'store',
        app: 'app',
        rootApp: 'rootApp',
        region: 'region',
      },

      // lifecycle callbacks
      initialize: () => {},
      beforeMount: () => {},
      afterMount: () => {},
      beforeUnmount: () => {},

      // override
      ...opts,
    };

    // errors
    if (!this.options.name) {
      throw new Error('Must provide `name` in options');
    }

    // container
    const Container = createContainer([
      { name: this.options.providerNames.app, useValue: this },
      { name: this.options.providerNames.rootApp, useValue: this.options.rootApp },
    ], {
      containerKey: this.options.providerNames.container,
    });
    this.container = resolveContainer(Container);

    // root app's providers
    this._registerRootProviders();

    this._registerBackwardsCompatibilityProviders();

    // self providers
    this.options.providers.forEach((provider) => {
      this.container.register(provider);
    });

    // children
    this._widgetsCollection = [];
    this._widgets$ = new BehaviorSubject(this._widgetsCollection);

    this.options.initialize();
  }

  _registerBackwardsCompatibilityProviders() {
    // backwards compatibility: component
    if (typeof this.options.component !== 'undefined') {
      console.warn('[DEPRECATED] `component` now needs to be defined as a provider.');
      this.options.providers.push({
        name: 'component',
        useValue: this.options.component,
        cascade: false,
      });
    }

    // backwards compatibility: store
    if (typeof this.options.store !== 'undefined') {
      console.warn('[DEPRECATED] `options.store` has been deprecated. Use `providers` for defining your Store instead.');
      this.options.providers.push({
        name: 'store',
        useValue: this.options.store,
        cascade: false,
      });
    } else if (typeof this.options.reducer === 'function') {
      console.warn('[DEPRECATED] `options.reducer` has been deprecated. Use `providers` for defining your Store instead.');
      this.options.providers.push({
        name: 'store',
        useFactory: (deps) => {
          const Store = createStore({
            initialState: this.options.initialState
              ? this.options.initialState
              : {},
            reducer: this.options.reducer,
            thunkArgument: deps,
            enableLogger: this.options.enableLogger,
          });

          return new Store();
        },
        cascade: false,
        deps: ['app'],
      });
    } else if (typeof this.options.initialState !== 'undefined') {
      console.warn('[DEPRECATED] `options.initialState` has been deprecated. Use `providers` for defining your Store instead.');
      this.options.providers.push({
        name: 'store',
        useFactory: (deps) => {
          const Store = createStore({
            initialState: this.options.initialState
              ? this.options.initialState
              : {},
            thunkArgument: deps,
            enableLogger: this.options.enableLogger,
          });

          return new Store();
        },
        cascade: false,
        deps: ['app'],
      });
    }

    // backwards compatibility: services
    if (typeof this.options.services !== 'undefined') {
      console.warn('[DEPRECATED] `options.services` has been deprecated. Use `providers` instead.');
      _.each(this.options.services, (ServiceClass, serviceName) => {
        this.options.providers.push({
          name: serviceName,
          useClass: ServiceClass,
          deps: ['app'],
          cascade: true,
        });
      });
    }

    // backwards compatibility: factories
    if (typeof this.options.factories !== 'undefined') {
      console.warn('[DEPRECATED] `options.factories` has been deprecated. Use `providers` instead.');
      _.each(this.options.factories, (FactoryClass, factoryName) => {
        this.options.providers.push({
          name: factoryName,
          useClass: FactoryClass,
          deps: ['app'],
          cascade: true,
          scoped: true,
        });
      });
    }

    // backwards compatibility: models
    if (typeof this.options.models !== 'undefined') {
      console.warn('[DEPRECATED] `options.models` has been deprecated. Use `providers` instead.');
      _.each(this.options.models, (ModelClass, modelName) => {
        if (typeof ModelClass !== 'function') {
          throw new Error(`Expected model class '${modelName}' to be a valid Model class`);
        }

        this.options.providers.push({
          name: modelName,
          useValue: new ModelClass(this.options.modelAttributes[modelName]),
          cascade: true,
        });
      });
    }
  }

  // @TODO: this method can be optimized further
  _registerRootProviders() {
    const rootApp = this.getRootApp();

    if (!rootApp || rootApp === this) {
      return;
    }

    rootApp.getProviders().forEach((rootProvider) => {
      // do not cascade
      if (!rootProvider.cascade) {
        return;
      }

      const definedProvider = Object.assign(
        {},
        _.omit(rootProvider, [
          'useClass',
          'useValue',
          'useFactory'
        ])
      );

      // non-scoped
      if (!rootProvider.scoped) {
        this.container.register({
          ...definedProvider,
          useValue: rootApp.get(rootProvider.name),
        });

        return;
      }

      // scoped
      if ('useValue' in rootProvider) {
        // `useValue` providers have no impact with scoping
        this.container.register({
          ...definedProvider,
          useValue: rootApp.get(rootProvider.name)
        });

        return;
      }

      if ('useClass' in rootProvider) {
        this.container.register({
          ...definedProvider,
          useClass: rootProvider.useClass,
        });

        return;
      }

      if ('useFactory' in rootProvider) {
        this.container.register({
          ...definedProvider,
          useFactory: rootProvider.useFactory
        });
      }

      return;
    });
  }

  getContainer() {
    return this.container;
  }

  getRootApp() {
    const rootApp = this.get(this.getOption('providerNames.rootApp'));

    if (rootApp) {
      return rootApp;
    }

    // backwards compatibility
    if (
      typeof window !== 'undefined' &&
      typeof window.app !== 'undefined'
    ) {
      return window.app;
    }

    return this;
  }

  getOption(key) {
    return _.get(this.options, key);
  }

  getProviders() {
    return this.options.providers;
  }

  getProvider(name) {
    return _.find(this.options.providers, (p) => {
      return p.name === name;
    });
  }

  getState$() {
    console.warn('[DEPRECATED] `getState$` has been deprecated. Access your store via `get` instead.');
    const store = this.get('store');

    if (!store) {
      return null;
    }

    return store.getState$();
  }

  get(providerName) {
    const value = this.container.get(providerName);

    if (typeof value !== 'undefined') {
      return value;
    }

    const rootApp = this.getRootApp();

    if (!rootApp) {
      return value
        ? value
        : null;
    }

    const provider = rootApp.getProvider(providerName);

    if (
      typeof provider !== 'undefined' &&
      provider.cascade === true
    ) {
      return rootApp.get(providerName);
    }

    return value
      ? value
      : null;
  }

  getWidgets$(regionName = null) {
    if (!regionName) {
      return this._widgets$;
    }

    return this._widgets$
      .map((collection) => {
        return collection
          .filter((w) => {
            return w.regions.indexOf(regionName) > -1;
          });
      });
  }

  registerWidget(Widget, opts = {}) {
    const options = {
      multi: false,
      ...opts,
    };

    if (typeof options.name !== 'undefined') {
      Object.defineProperty(Widget, 'frintAppName', {
        value: options.name,
        configurable: true,
      });
    }

    const existingIndex = _.findIndex(this._widgetsCollection, (w) => {
      return w.name === Widget.frintAppName;
    });

    if (existingIndex !== -1) {
      throw new Error(`Widget '${Widget.frintAppName}' has been already registered before.`);
    }

    this._widgetsCollection.push({
      ...options,
      name: Widget.frintAppName,
      App: Widget,
      regions: options.regions || [],
      instances: {},
    });

    if (options.multi === false) {
      this.instantiateWidget(Widget.frintAppName);
    }

    this._widgets$.next(this._widgetsCollection);
  }

  hasWidgetInstance(name, region = null, regionKey = null) {
    const instance = this.getWidgetInstance(name, region, regionKey);

    if (typeof instance !== 'undefined') {
      return true;
    }

    return false;
  }

  getWidgetInstance(name, region = null, regionKey = null) {
    const index = _.findIndex(this._widgetsCollection, (w) => {
      return w.name === name;
    });

    if (index === -1) {
      return false;
    }

    const w = this._widgetsCollection[index];
    const instanceKey = makeInstanceKey(region, regionKey, w.multi);

    return w.instances[instanceKey];
  }

  getWidgetOnceAvailable$(name, region = null, regionKey = null) {
    const rootApp = this.getRootApp();

    return Observable
      .interval(100) // every X ms
      .map(() => rootApp.getWidgetInstance(name, region, regionKey))
      .first(widget => widget);
  }

  instantiateWidget(name, region = null, regionKey = null) {
    const index = _.findIndex(this._widgetsCollection, (w) => {
      return w.App.frintAppName === name;
    });

    if (index === -1) {
      throw new Error(`No widget found with name '${name}'.`);
    }

    const w = this._widgetsCollection[index];
    const key = makeInstanceKey(region, regionKey, w.multi);

    this._widgetsCollection[index].instances[key] = new w.App({
      ..._.omit(w, ['App', 'instances']),
      name: w.App.frintAppName,
      rootApp: this,
    });

    return this._widgetsCollection[index].instances[key];
  }

  // unregisterWidget(name, region = null, regionKey = null) {
  //   // @TODO
  // }

  beforeMount() {
    return this.options.beforeMount.bind(this)();
  }

  getComponent(componentProps = null) {
    const Component = this.get(this.getOption('providerNames.component'));
    const self = this;

    return () => (
      <Provider app={self}>
        <Component {...componentProps} />
      </Provider>
    );
  }

  render(...args) {
    console.warn('[DEPRECATED] `render` has been deprecated. Use `getComponent` instead.');
    return this.getComponent(...args);
  }

  _getAppByName(appName = null) {
    if (!appName) {
      return this;
    }

    const rootApp = this.getRootApp();
    if (!rootApp) {
      return null;
    }

    const foundWidget = _.find(rootApp._widgetsCollection, (w) => {
      return w.name = appName;
    });

    if (!foundWidget) {
      return null;
    }

    return foundWidget.instances.default;
  }

  getStore(appName = null) {
    console.warn('[DEPRECATED] `getStore` has been deprecated. Use `get` instead.');
    if (!appName) {
      return this.container.get(this.options.providerNames.store);
    }

    const w = this._getAppByName(appName);
    if (!w) {
      return null;
    }

    return w.instances.default.getStore();
  }

  afterMount() {
    return this.options.afterMount.bind(this)();
  }

  beforeUnmount() {
    const output = this.options.beforeUnmount.bind(this)();

    return output;
  }

  getModel(name) {
    console.warn('[DEPRECATED] `getModel` has been deprecated. Use `get` instead.');
    return this.get(name);
  }

  getService(name) {
    console.warn('[DEPRECATED] `getService` has been deprecated. Use `get` instead.');
    return this.get(name);
  }

  getFactory(name) {
    console.warn('[DEPRECATED] `getFactory` has been deprecated. Use `get` instead.');
    return this.get(name);
  }
}

export default function createApp(options = {}) {
  class App extends BaseApp {
    constructor(opts = {}) {
      super(_.merge(
        options,
        opts
      ));
    }
  }

  if (typeof options.name !== 'undefined') {
    Object.defineProperty(App, 'frintAppName', {
      value: options.name,
      configurable: true,
    });
  }

  return App;
}
