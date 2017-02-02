/* eslint-disable no-console, no-underscore-dangle */
/* globals window */
import { Subject } from 'rxjs';
import _ from 'lodash';
import { createContainer, resolveContainer } from 'diyai';

import createStore from './createStore';
import Provider from './components/Provider';
import h from './h';

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
      },

      // lifecycle callbacks
      initialize: () => {},
      beforeMount: () => {},
      afterMount: () => {},
      beforeUnmount: () => {},

      // override
      ...opts
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
      if (typeof provider.useFactory === 'function') {
        const givenFactory = provider.useFactory;
        provider.useFactory = () => {
          return givenFactory(this);
        };
      }

      this.container.register(provider);
    });

    this._widgetsRegistry = {};

    this.options.initialize();
  }

  getContainer() {
    return this.container;
  }

  getRootApp() {
    return this.get(this.getOption('providerNames.rootApp'));
  }

  getOption(key) {
    return _.get(this.options, key);
  }

  get(providerName) {
    return this.container.get(providerName);
  }

  getWidgets$(regionName, regionKey = null) {
    //
  }

  registerWidget(Widget, opts = {}) {
    const options = {
      override: {}, // override App options while instantiating
      multi: false, // needs multiple instances?
      name: null, // register the App as this name if different from Widget.name
      ...opts,
    };

    if (typeof Widget.name !== 'string') {
      throw new Error(`No name found`);
    }

    if (typeof options.name !== 'undefined') {
      Object.defineProperty(Widget, 'name', { value: options.name });
    }

    if (typeof this._widgetsRegistry[Widget.name] !== 'undefined') {
      throw new Error(`Widget has been already registered before.`);
    }

    const { name } = options;
    this._widgetsRegistry[name] = {
      App: Widget,
      regions: options.regions || [],
      instances: {},
    };

    if (options.multi === false) {
      this._widgetsRegistry[name].instances['$default'] = new Widget({
        ...options.override,
        name: Widget.name,
      });
    }
  }

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

  if (typeof options.name === 'string') {
    Object.defineProperty(App, 'name', { value: options.name });
  }

  return App;
}
