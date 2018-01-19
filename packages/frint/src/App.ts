import { find, findIndex, get, omit } from 'lodash';
import { BehaviorSubject } from 'rxjs';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { of as of$ } from 'rxjs/observable';
import { concatMap as concatMap$, find as find$, first as first$, map as map$ } from 'rxjs/operators';
// import { concatMap as concatMap$ } from 'rxjs/operators/concatMap';
// import { find as find$ } from 'rxjs/operators/find';
// import { first as first$ } from 'rxjs/operators/first';
// import { map as map$ } from 'rxjs/operators/map';
import { createContainer, IContainer, IProvider, resolveContainer } from 'travix-di';

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

interface IProviderNames {
  component: string;
  container: string;
  store: string;
  app: string;
  parentApp: string;
  rootApp: string;
  region: string;
}

interface IRegisterAppOptions {
  name?: string;
  multi?: boolean;
  regions?: string[];
  initialize?: () => void;
}

interface IFrintProvider extends IProvider {
  cascade?: boolean;
  scoped?: boolean;
}

const defaultProviderNames = {
  component: 'component',
  container: 'container',
  store: 'store',
  app: 'app',
  parentApp: 'parentApp',
  rootApp: 'rootApp',
  region: 'region',
};

interface IAppRegistration {
  // tslint:disable-next-line:variable-name
  AppClass: typeof App;
  name: string;
  regions: any[];
  instances: { [name: string]: App };
  multi: boolean;
  initialize?: () => void;
}

export interface IAppOptions {
  name: string;
  parentApp?: App;
  providers?: IFrintProvider[];
  providerNames?: IProviderNames;
  initialize?: () => void;
  beforeDestroy?: () => void;
}

interface IAppClass {
  frintAppName?: string;
  new(opts: IAppOptions): App;
}

export class App {
  public container: IContainer;
  private options: IAppOptions;
  private _appsCollection: IAppRegistration[];
  private _apps$: BehaviorSubject<IAppRegistration[]>;

  constructor(opts: IAppOptions) {
    this.options = {
      name: null,
      parentApp: null,
      providers: [],

      providerNames: defaultProviderNames,

      // lifecycle callbacks
      // tslint:disable-next-line:no-empty
      initialize: () => {},
      // tslint:disable-next-line:no-empty
      beforeDestroy: () => {},

      // override
      ...opts,
    };

    // errors
    if (!this.options.name) {
      throw new Error('Must provide `name` in options');
    }

    // children - create Observable if root
    this._appsCollection = [];
    this._apps$ = new BehaviorSubject(this._appsCollection);

    // container
    const container = createContainer([
      { name: this.options.providerNames.app, useDefinedValue: this },
      { name: this.options.providerNames.parentApp, useDefinedValue: this.getParentApp() },
      { name: this.options.providerNames.rootApp, useDefinedValue: this.getRootApp() },
    ], {
      containerName: this.options.providerNames.container,
    });

    this.container = resolveContainer(container);

    // root app's providers
    this._registerRootProviders();

    // self providers
    this.options.providers.forEach((provider) => {
      this.container.register(provider);
    });

    this.options.initialize.bind(this)();
  }

  public getContainer() {
    return this.container;
  }

  public getRootApp() {
    const parents = this.getParentApps();

    if (parents.length === 0) {
      return this;
    }

    return parents.pop();
  }

  public getParentApp() {
    return this.options[this.options.providerNames.parentApp] as App || null;
  }

  public getParentApps() {
    function findParents(app: App, parents: App[] = []): App[] {
      const parentApp = app.getParentApp();

      if (!parentApp) {
        return parents;
      }

      parents.push(parentApp);
      return findParents(parentApp, parents);
    }

    return findParents(this);
  }

  public getOption(key) {
    return get(this.options, key);
  }

  public getName() {
    return this.getOption('name');
  }

  public getProviders() {
    return this.options.providers;
  }

  public getProvider(name) {
    return find(this.options.providers, (p) => {
      return p.name === name;
    });
  }

  public get(providerName) {
    const value = this.container.get<IFrintProvider>(providerName);

    if (typeof value !== 'undefined') {
      return value;
    }

    return null;
  }

  public getApps$(regionName = null) {
    if (!regionName) {
      return this._apps$;
    }

    return this._apps$
      .pipe(map$((collection) => {
        return collection
          .filter((w) => {
            return w.regions.indexOf(regionName) > -1;
          });
      }));
  }

  public registerApp(AppClass: IAppClass, opts: IRegisterAppOptions = {}) {
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

    const existingIndex = findIndex(this._appsCollection, (w) => {
      return w.name === AppClass.frintAppName;
    });

    if (existingIndex !== -1) {
      throw new Error(`App '${AppClass.frintAppName}' has been already registered before.`);
    }

    this._appsCollection.push({
      ...options,
      name: AppClass.frintAppName,
      AppClass,
      instances: {},
      regions: options.regions || [],
    });

    if (options.multi === false) {
      this.instantiateApp(AppClass.frintAppName);
    }

    this._apps$.next(this._appsCollection);
  }

  public hasAppInstance(name, region = null, regionKey = null) {
    const instance = this.getAppInstance(name, region, regionKey);

    if (instance && typeof instance !== 'undefined') {
      return true;
    }

    return false;
  }

  public getAppInstance(name, region = null, regionKey = null) {
    const index = findIndex(this._appsCollection, a => {
      return a.name === name;
    });

    if (index === -1) {
      return null;
    }

    const app = this._appsCollection[index];
    const instanceKey = makeInstanceKey(region, regionKey, app.multi);
    const instance = app.instances[instanceKey];

    if (!instance || typeof instance === 'undefined') {
      return null;
    }

    return instance;
  }

  public getAppOnceAvailable$(name, region = null, regionKey = null) {
    const rootApp = this.getRootApp();

    const w = rootApp.getAppInstance(name, region, regionKey);

    if (w) {
      return of$(w);
    }

    return rootApp._apps$
      .pipe(
        concatMap$(y => y),
        find$(app => app.name === name),
        map$((x) => {
          const instanceKey = makeInstanceKey(region, regionKey, x.multi);
          return x.instances[instanceKey];
        }),
        first$()
      );
  }

  public instantiateApp(name, region = null, regionKey = null) {
    const index = findIndex(this._appsCollection, a => {
      // HACK: we should handle frintAppName differently.
      return (a.AppClass as any).frintAppName === name;
    });

    if (index === -1) {
      throw new Error(`No app found with name '${name}'.`);
    }

    const w = this._appsCollection[index];
    const key = makeInstanceKey(region, regionKey, w.multi);

    this._appsCollection[index].instances[key] = new w.AppClass({
      ...omit(w, ['AppClass', 'instances']) as IAppOptions,
      name: (w.AppClass as any).frintAppName,
      parentApp: this,
    });

    return this._appsCollection[index].instances[key];
  }

  public destroyApp(name, region = null, regionKey = null) {
    const index = findIndex(this._appsCollection, a => {
      if (!a || !a.AppClass) {
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
  }

  public beforeDestroy() {
    return this.options.beforeDestroy.bind(this)();
  }

  private _registerRootProviders() {
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
          omit(parentProvider, [
            'useClass',
            'useValue',
            'useFactory'
          ])
        ) as IProvider;

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
  }
}

// unregisterApp(name, region = null, regionKey = null) {
//   // @TODO
// }
