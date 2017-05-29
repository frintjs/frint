/* global window */
/* eslint-disable no-console, import/no-extraneous-dependencies */
import _ from 'lodash';
import React from 'react';

export default function extendApp(Frint, FrintStore, FrintReact) {
  const { App } = Frint;
  const { createStore } = FrintStore;
  const { getMountableComponent } = FrintReact;

  const previousGetRootApp = App.prototype.getRootApp;
  App.prototype.getRootApp = function getRootApp() {
    if (
      typeof window !== 'undefined' &&
      typeof window.app !== 'undefined'
    ) {
      return window.app;
    }

    return previousGetRootApp.bind(this)();
  };

  const previousRegisterRootProviders = App.prototype._registerRootProviders;
  App.prototype._registerRootProviders = function _registerRootProviders() {
    previousRegisterRootProviders.bind(this)();

    this._backwardsCompatibility();
  };

  App.prototype._backwardsCompatibility = function _backwardsCompatibility() {
    this.readableAppNames = [];
    const enableLogger = typeof this.options.enableLogger !== 'undefined'
      ? this.options.enableLogger
      : true;

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
            enableLogger,
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
            enableLogger,
          });

          return new Store();
        },
        cascade: false,
        deps: ['app'],
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
  };

  App.prototype.getState$ = function getState$(appName = null) {
    console.warn('[DEPRECATED] `getState$` has been deprecated. Access your store via `get` instead.');

    const app = appName
      ? this._getAppByName(appName)
      : this;

    if (!app) {
      return null;
    }

    const store = app.get('store');

    if (!store) {
      return null;
    }

    return store.getState$();
  };

  App.prototype.dispatch = function dispatch(action) {
    console.warn('[DEPRECATED] `dispatch` has been deprecated. Access your store via `get` instead.');
    return this.get('store').dispatch(action);
  };

  App.prototype.render = function render(...args) {
    console.warn('[DEPRECATED] `render` has been deprecated.');
    const Component = getMountableComponent(this);

    return () => {
      return <Component {...args} />;
    };
  };

  App.prototype._getAppByName = function _getAppByName(appName = null) {
    if (!appName) {
      return this;
    }

    const rootApp = this.getRootApp();
    if (!rootApp) {
      return null;
    }

    const foundApp = _.find(rootApp._appsCollection, (w) => {
      return w.name === appName;
    });

    if (!foundApp) {
      return null;
    }

    return foundApp.instances.default;
  };

  App.prototype.getStore = function getStore(appName = null) {
    console.warn('[DEPRECATED] `getStore` has been deprecated. Use `get` instead.');
    if (!appName) {
      return this.container.get(this.options.providerNames.store);
    }

    const w = this._getAppByName(appName);
    if (!w) {
      return null;
    }

    return w.getStore();
  };

  App.prototype.getModel = function getModel(name) {
    console.warn('[DEPRECATED] `getModel` has been deprecated. Use `get` instead.');
    return this.get(name);
  };

  App.prototype.getService = function getService(name) {
    console.warn('[DEPRECATED] `getService` has been deprecated. Use `get` instead.');
    return this.get(name);
  };

  App.prototype.getFactory = function getFactory(name) {
    console.warn('[DEPRECATED] `getFactory` has been deprecated. Use `get` instead.');
    return this.get(name);
  };

  App.prototype.setRegion = function setRegion(region) {
    console.warn('[DEPRECATED] `setRegion` has been deprecated. Use `registerApp` instead.');
    return this.setRegions([region]);
  };

  App.prototype.setRegions = function setRegions(regions = []) {
    console.warn('[DEPRECATED] `setRegions` has been deprecated. Use `registerApp` instead.');
    const rootApp = this.getRootApp();

    if (!rootApp || this === rootApp) {
      throw new Error('No root app instance available');
    }

    rootApp._appsCollection.push({
      name: this.options.name,
      regions,
      instances: {
        default: this,
      },
    });

    rootApp._apps$.next(rootApp._appsCollection);
  };

  App.prototype.getWidgets = function getWidgets(regionName = null) {
    console.warn('[DEPRECATED] `getWidgets` has been deprecated. Use `getApps$` instead.');
    return this.getRootApp()._appsCollection
      .filter((w) => {
        if (!regionName) {
          return true;
        }

        return w.regions.indexOf(regionName) > -1;
      })
      .map((w) => {
        return w.instances.default;
      });
  };

  App.prototype.readStateFrom = function readStateFrom(appNames = []) {
    console.log('[DEPRECATED] `readStateFrom` has been deprecated.');
    this.options.readableApps = appNames;
  };

  ['beforeMount', 'afterMount', 'beforeUnmount'].forEach((hookName) => {
    App.prototype[hookName] = function lifecycleHook(...args) {
      const providedHook = this.options[hookName];
      const hook = typeof providedHook === 'function'
        ? providedHook
        : function noop() { };
      this[hookName] = hook.bind(this);

      return this[hookName](...args);
    };
  });
}
