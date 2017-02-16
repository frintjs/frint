/* global window */
import { BehaviorSubject, Observable } from 'rxjs';
import _ from 'lodash';
import { createContainer, resolveContainer } from 'diyai';

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

  // self providers
  this.options.providers.forEach((provider) => {
    this.container.register(provider);
  });

  // children
  this._widgetsCollection = [];
  this._widgets$ = new BehaviorSubject(this._widgetsCollection);

  this.options.initialize();
}

App.prototype._registerRootProviders = function _registerRootProviders() {
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
  });
};

App.prototype.getContainer = function getContainer() {
  return this.container;
};

App.prototype.getRootApp = function getRootApp() {
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
};

App.prototype.getOption = function getOption(key) {
  return _.get(this.options, key);
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

  const rootApp = this.getRootApp();

  if (!rootApp) {
    return value || null;
  }

  const provider = rootApp.getProvider(providerName);

  if (
    typeof provider !== 'undefined' &&
    provider.cascade === true
  ) {
    return rootApp.get(providerName);
  }

  return value || null;
};

App.prototype.getWidgets$ = function getWidgets$(regionName = null) {
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
};


App.prototype.registerWidget = function registerWidget(Widget, opts = {}) {
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
};

App.prototype.hasWidgetInstance = function hasWidgetInstance(name, region = null, regionKey = null) {
  const instance = this.getWidgetInstance(name, region, regionKey);

  if (typeof instance !== 'undefined') {
    return true;
  }

  return false;
};

App.prototype.getWidgetInstance = function getWidgetInstance(name, region = null, regionKey = null) {
  const index = _.findIndex(this._widgetsCollection, (w) => {
    return w.name === name;
  });

  if (index === -1) {
    return false;
  }

  const w = this._widgetsCollection[index];
  const instanceKey = makeInstanceKey(region, regionKey, w.multi);

  return w.instances[instanceKey];
};

App.prototype.getWidgetOnceAvailable$ = function getWidgetOnceAvailable$(name, region = null, regionKey = null) {
  const rootApp = this.getRootApp();

  const w = rootApp.getWidgetInstance(name, region, regionKey);
  if (w) {
    return Observable.of(w);
  }

  return Observable
    .interval(100) // every X ms
    .map(() => rootApp.getWidgetInstance(name, region, regionKey))
    .first(widget => widget);
};

App.prototype.instantiateWidget = function instantiateWidget(name, region = null, regionKey = null) {
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
};

// unregisterWidget(name, region = null, regionKey = null) {
//   // @TODO
// }

App.prototype.beforeMount = function beforeMount() {
  return this.options.beforeMount.bind(this)();
};

App.prototype.afterMount = function afterMount() {
  return this.options.afterMount.bind(this)();
};

App.prototype.beforeUnmount = function beforeUnmount() {
  const output = this.options.beforeUnmount.bind(this)();

  return output;
};

export default App;
