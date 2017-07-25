import { BehaviorSubject, Observable } from 'rxjs';
import _ from 'lodash';
import { createContainer, resolveContainer } from 'travix-di';

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

function App(opts = {}) {
  this.options = {
    name: null,
    parentApp: null,
    providers: [],

    providerNames: {
      component: 'component',
      container: 'container',
      store: 'store',
      app: 'app',
      parentApp: 'parentApp',
      rootApp: 'rootApp',
      region: 'region',
    },

    // lifecycle callbacks
    initialize: () => {},
    beforeDestroy: () => {},

    // override
    ...opts,
  };

  // errors
  if (!this.options.name) {
    throw new Error('Must provide `name` in options');
  }

  // container
  const Container = createContainer([
    { name: this.options.providerNames.app, useDefinedValue: this },
    { name: this.options.providerNames.parentApp, useDefinedValue: this.getParentApp() },
    { name: this.options.providerNames.rootApp, useDefinedValue: this.getRootApp() },
  ], {
    containerKey: this.options.providerNames.container,
  });
  this.container = resolveContainer(Container);

  // root app's providers
  this._registerRootProviders();

  // self providers
  this.options.providers.forEach((provider) => {
    this.container.register(provider);
  });

  // children - create Observable if root
  this._appsCollection = [];
  this._apps$ = new BehaviorSubject(this._appsCollection);

  this.options.initialize.bind(this)();
}

App.prototype._registerRootProviders = function _registerRootProviders() {
  const parentApps = this.getParentApps();

  if (parentApps.length === 0) {
    return;
  }

  parentApps.reverse().forEach((parentApp) => {
    parentApp.getProviders().forEach((parentProvider) => {
      // do not cascade
      if (!parentProvider.cascade) {
        return;
      }

      const definedProvider = Object.assign(
        {},
        _.omit(parentProvider, [
          'useClass',
          'useValue',
          'useFactory'
        ])
      );

      // non-scoped
      if (!parentProvider.scoped) {
        this.container.register({
          ...definedProvider,
          useValue: parentApp.get(parentProvider.name),
        });

        return;
      }

      // scoped
      if ('useValue' in parentProvider) {
        // `useValue` providers have no impact with scoping
        this.container.register({
          ...definedProvider,
          useValue: parentApp.get(parentProvider.name)
        });

        return;
      }

      if ('useClass' in parentProvider) {
        this.container.register({
          ...definedProvider,
          useClass: parentProvider.useClass,
        });

        return;
      }

      if ('useFactory' in parentProvider) {
        this.container.register({
          ...definedProvider,
          useFactory: parentProvider.useFactory
        });
      }
    });
  });
};

App.prototype.getContainer = function getContainer() {
  return this.container;
};

App.prototype.getRootApp = function getRootApp() {
  const parents = this.getParentApps();

  if (parents.length === 0) {
    return this;
  }

  return parents.pop();
};

App.prototype.getParentApp = function getParentApp() {
  return this.options[this.options.providerNames.parentApp] || null;
};

App.prototype.getParentApps = function getParentApps() {
  function findParents(app, parents = []) {
    const parentApp = app.getParentApp();

    if (!parentApp) {
      return parents;
    }

    parents.push(parentApp);
    return findParents(parentApp, parents);
  }

  return findParents(this);
};

App.prototype.getOption = function getOption(key) {
  return _.get(this.options, key);
};

App.prototype.getName = function getName() {
  return this.getOption('name');
};

App.prototype.getProviders = function getProviders() {
  return this.options.providers;
};

App.prototype.getProvider = function getProvider(name) {
  return _.find(this.options.providers, (p) => {
    return p.name === name;
  });
};

App.prototype.get = function get(providerName) {
  const value = this.container.get(providerName);

  if (typeof value !== 'undefined') {
    return value;
  }

  return null;
};

App.prototype.getApps$ = function getApps$(regionName = null) {
  if (!regionName) {
    return this._apps$;
  }

  return this._apps$
    .map((collection) => {
      return collection
        .filter((w) => {
          return w.regions.indexOf(regionName) > -1;
        });
    });
};

App.prototype.registerApp = function registerApp(AppClass, opts = {}) {
  const options = {
    multi: false,
    ...opts,
  };

  if (typeof options.name !== 'undefined') {
    Object.defineProperty(AppClass, 'frintAppName', {
      value: options.name,
      configurable: true,
    });
  }

  const existingIndex = _.findIndex(this._appsCollection, (w) => {
    return w.name === AppClass.frintAppName;
  });

  if (existingIndex !== -1) {
    throw new Error(`App '${AppClass.frintAppName}' has been already registered before.`);
  }

  this._appsCollection.push({
    ...options,
    name: AppClass.frintAppName,
    App: AppClass,
    regions: options.regions || [],
    instances: {},
  });

  if (options.multi === false) {
    this.instantiateApp(AppClass.frintAppName);
  }

  this._apps$.next(this._appsCollection);
};

App.prototype.hasAppInstance = function hasAppInstance(name, region = null, regionKey = null) {
  const instance = this.getAppInstance(name, region, regionKey);

  if (instance && typeof instance !== 'undefined') {
    return true;
  }

  return false;
};

App.prototype.getAppInstance = function getAppInstance(name, region = null, regionKey = null) {
  const index = _.findIndex(this._appsCollection, (w) => {
    return w.name === name;
  });

  if (index === -1) {
    return null;
  }

  const w = this._appsCollection[index];
  const instanceKey = makeInstanceKey(region, regionKey, w.multi);
  const instance = w.instances[instanceKey];

  if (!instance || typeof instance === 'undefined') {
    return null;
  }

  return instance;
};

App.prototype.getAppOnceAvailable$ = function getAppOnceAvailable$(name, region = null, regionKey = null) {
  const rootApp = this.getRootApp();

  const w = rootApp.getAppInstance(name, region, regionKey);

  if (w) {
    return Observable.of(w);
  }

  return rootApp._apps$
    .concatMap(y => y)
    .find(app => app.name === name)
    .map((x) => {
      const instanceKey = makeInstanceKey(region, regionKey, x.multi);
      return x.instances[instanceKey];
    })
    .first(y => y);
};

App.prototype.instantiateApp = function instantiateApp(name, region = null, regionKey = null) {
  const index = _.findIndex(this._appsCollection, (w) => {
    return w.App.frintAppName === name;
  });

  if (index === -1) {
    throw new Error(`No app found with name '${name}'.`);
  }

  const w = this._appsCollection[index];
  const key = makeInstanceKey(region, regionKey, w.multi);

  this._appsCollection[index].instances[key] = new w.App({
    ..._.omit(w, ['App', 'instances']),
    name: w.App.frintAppName,
    parentApp: this,
  });

  return this._appsCollection[index].instances[key];
};

App.prototype.destroyApp = function destroyApp(name, region = null, regionKey = null) {
  const index = _.findIndex(this._appsCollection, (w) => {
    if (!w || !w.App) {
      return false;
    }

    return w.App.frintAppName === name;
  });

  if (index === -1) {
    throw new Error(`No app found with name '${name}'.`);
  }

  const w = this._appsCollection[index];
  const key = makeInstanceKey(region, regionKey, w.multi);

  if (typeof this._appsCollection[index].instances[key] === 'undefined') {
    throw new Error(`No instance with key '${key}' found for app with name '${name}'.`);
  }

  this._appsCollection[index].instances[key].beforeDestroy();
  delete this._appsCollection[index].instances[key];
};

App.prototype.beforeDestroy = function beforeDestroy() {
  return this.options.beforeDestroy.bind(this)();
};

// @TODO: Get rid of *Widget* aliases
[
  { alias: 'getWidgets$', fn: 'getApps$' },
  { alias: 'registerWidget', fn: 'registerApp' },
  { alias: 'hasWidgetInstance', fn: 'hasWidgetInstance' },
  { alias: 'getWidgetInstance', fn: 'getAppInstance' },
  { alias: 'getWidgetOnceAvailable$', fn: 'getAppOnceAvailable$' },
  { alias: 'destroyWidget', fn: 'destroyApp' },
].forEach(({ alias, fn }) => {
  App.prototype[alias] = function deprecatedAlias(...args) {
    // eslint-disable-next-line no-console, prefer-template
    console.warn('[DEPRECATED] `' + alias + '` has been deprecated. Use `' + fn + '` instead');
    this[fn](...args);
  };
});

// unregisterApp(name, region = null, regionKey = null) {
//   // @TODO
// }

export default App;
