/* eslint-disable no-console, no-underscore-dangle */
/* globals window */
import { BehaviorSubject, Observable } from 'rxjs';
import _ from 'lodash';
import { createContainer, resolveContainer } from 'diyai';

import Provider from './components/Provider';
import h from './h';

function makeInstanceKey(region = null, regionKey = null, reuse) {
  if (
    reuse === true ||
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

    this.options.providers.forEach((provider) => {
      this.container.register(provider);
    });

    this._widgetsCollection = [];
    this._widgets$ = new BehaviorSubject(this._widgetsCollection);

    this.options.initialize();
  }

  getContainer() {
    return this.container;
  }

  getRootApp() {
    const rootApp = this.get(this.getOption('providerNames.rootApp'));

    if (rootApp) {
      return rootApp;
    }

    return this;
  }

  getOption(key) {
    return _.get(this.options, key);
  }

  get(providerName) {
    return this.container.get(providerName);
  }

  // @TODO: figure out regionKey
  getWidgets$(regionName = null, regionKey = null) {
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
      // @TODO: decide on a better name
      // this holds info whether the App needs to be instantiated on load
      // or only when the targetted Region is made available
      reuse: true,
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

    if (options.reuse === true) {
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
    const instanceKey = makeInstanceKey(region, regionKey, w.reuse);

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
    const key = makeInstanceKey(region, regionKey);

    const index = _.findIndex(this._widgetsCollection, (w) => {
      return w.App.frintAppName === name;
    });

    if (index === -1) {
      throw new Error(`No widget found with name '${name}'.`);
    }

    const w = this._widgetsCollection[index];

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

  getStore() {
    return this.container.get(this.options.providerNames.store);
  }

  afterMount() {
    return this.options.afterMount.bind(this)();
  }

  beforeUnmount() {
    const output = this.options.beforeUnmount.bind(this)();

    return output;
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
