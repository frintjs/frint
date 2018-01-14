/* eslint-disable import/no-extraneous-dependencies, func-names, no-new, class-methods-use-this */
/* global describe, it */
import { expect } from 'chai';
import { last } from 'rxjs/operators/last';
import { take } from 'rxjs/operators/take';

import { App } from './App';
import createApp from './createApp';

describe('frint  › App', () => {
  it('throws error when creating new instance without name', () => {
    expect(() => {
      // tslint:disable-next-line:no-unused-expression
      new App({ name: undefined });
    }).to.throw(/Must provide `name` in options/);
  });

  it('gets option value', () => {
    const app = new App({
      name: 'MyApp',
    });

    expect(app.getName()).to.equal('MyApp');
  });

  it('gets parent and root app', () => {
    const rootApp = new App({
      name: 'RootApp',
    });

    const childApp = new App({
      name: 'ChildApp',
      parentApp: rootApp,
    });

    const grandchildApp = new App({
      name: 'GrandchildApp',
      parentApp: childApp,
    });

    expect(rootApp.getName()).to.equal('RootApp');
    expect(childApp.getName()).to.equal('ChildApp');
    expect(rootApp.getParentApps()).to.deep.equal([]);

    expect(childApp.getParentApp()).to.deep.equal(rootApp);
    expect(childApp.getRootApp()).to.deep.equal(rootApp);
    expect(
      childApp
        .getParentApps()
        .map(x => x.getOption('name'))
    ).to.deep.equal([
      'RootApp'
    ]);

    expect(grandchildApp.getParentApp()).to.deep.equal(childApp);
    expect(grandchildApp.getRootApp()).to.deep.equal(rootApp);
    expect(
      grandchildApp
        .getParentApps()
        .map(x => x.getOption('name'))
    ).to.deep.equal([
      'ChildApp',
      'RootApp',
    ]);
  });

  it('registers providers with direct values', () => {
    const app = new App({
      name: 'MyApp',
      providers: [
        { name: 'foo', useValue: 'fooValue' },
      ],
    });

    expect(app.get('foo')).to.equal('fooValue');
  });

  it('registers providers with factory values', () => {
    const app = new App({
      name: 'MyApp',
      providers: [
        { name: 'foo', useFactory: () => 'fooValue' },
      ],
    });

    expect(app.get('foo')).to.equal('fooValue');
  });

  it('registers providers with class values', () => {
    class Foo {
      public getValue() {
        return 'fooValue';
      }
    }

    const app = new App({
      name: 'MyApp',
      providers: [
        { name: 'foo', useClass: Foo },
      ],
    });

    expect(app.get('foo').getValue()).to.equal('fooValue');
  });

  it('registers providers with dependencies', () => {
    class Baz {
      private foo;
      private bar;

      constructor({ foo, bar }) {
        this.foo = foo;
        this.bar = bar;
      }

      public getValue() {
        return `bazValue, ${this.foo}, ${this.bar}`;
      }
    }

    const app = new App({
      name: 'MyApp',
      providers: [
        {
          name: 'foo',
          useValue: 'fooValue'
        },
        {
          name: 'bar',
          useFactory: ({ foo }) => {
            return `barValue, ${foo}`;
          },
          deps: ['foo'],
        },
        {
          name: 'baz',
          useClass: Baz,
          deps: ['foo', 'bar'],
        }
      ],
    });

    expect(app.get('foo')).to.equal('fooValue');
    expect(app.get('bar')).to.equal('barValue, fooValue');
    expect(app.get('baz').getValue()).to.equal('bazValue, fooValue, barValue, fooValue');
  });

  it('returns services from Root that are cascaded', () => {
    class ServiceC {
      public getValue() {
        return 'serviceC';
      }
    }

    const Root = createApp({
      name: 'MyApp',
      providers: [
        {
          name: 'serviceA',
          useValue: 'serviceA',
          scoped: true,
          cascade: true,
        },
        {
          name: 'serviceB',
          useFactory: () => 'serviceB',
          scoped: true,
          cascade: true,
        },
        {
          name: 'serviceC',
          useClass: ServiceC,
          cascade: true,
        },
        {
          name: 'serviceCScoped',
          useClass: ServiceC,
          cascade: true,
          scoped: true,
        },
        {
          name: 'serviceD',
          useValue: 'serviceD',
          cascade: false,
        },
        {
          name: 'serviceE',
          useValue: 'serviceE',
          cascade: true,
          scoped: false,
        }
      ],
    });

    const App1 = createApp({ name: 'App1' });

    const root = new Root();
    root.registerApp(App1);

    const app = root.getAppInstance('App1');
    // expect(app.get('serviceA')).to.equal('serviceA');
    expect(app.get('serviceB')).to.equal('serviceB');
    expect(app.get('serviceC').getValue()).to.equal('serviceC');
    expect(app.get('serviceD')).to.equal(null);
    expect(app.get('serviceE')).to.equal('serviceE');

    expect(app.get('serviceF')).to.equal(null);
    expect(root.get('serviceF')).to.equal(null);
  });

  it('returns null when service is non-existent in both Child App and Root', () => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const app = new Root();
    app.registerApp(App1);

    const serviceA = app
      .getAppInstance('App1')
      .get('serviceA');

    expect(serviceA).to.equal(null);
  });

  it('gets container', () => {
    const app = new App({
      name: 'MyApp'
    });

    expect(app.getContainer()).to.deep.equal(app.container);
  });

  it('gets providers definition list', () => {
    const app = new App({
      name: 'MyApp',
      providers: [
        { name: 'foo', useValue: 'fooValue' },
      ],
    });

    expect(app.getProviders()).to.deep.equal([
      { name: 'foo', useValue: 'fooValue' },
    ]);
  });

  it('gets individual provider definition', () => {
    const app = new App({
      name: 'MyApp',
      providers: [
        { name: 'foo', useValue: 'fooValue' },
      ],
    });

    expect(app.getProvider('foo')).to.deep.equal({ name: 'foo', useValue: 'fooValue' });
  });

  it('calls initialize during construction, as passed in options', () => {
    let called = false;

    const app = new App({
      name: 'MyApp',
      initialize() {
        called = true;
      }
    });

    expect(app.getName()).to.equal('MyApp');
    expect(called).to.equal(true);
  });

  it('calls beforeDestroy, as passed in options', () => {
    let called = false;

    const app = new App({
      name: 'MyApp',
      beforeDestroy() {
        called = true;
      }
    });
    app.beforeDestroy();

    expect(app.getName()).to.equal('MyApp');
    expect(called).to.equal(true);
  });

  it('registers apps', () => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const app = new Root();

    app.registerApp(App1, {
      regions: ['sidebar'],
    });

    expect(app.hasAppInstance('App1')).to.equal(true);
    expect(app.getAppInstance('App1').getOption('name')).to.equal('App1');
  });

  it('registers apps, by overriding options', () => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const app = new Root();

    app.registerApp(App1, {
      name: 'AppOne',
      regions: ['sidebar'],
    });

    expect(app.hasAppInstance('AppOne')).to.equal(true);
    expect(app.getAppInstance('AppOne').getOption('name')).to.equal('AppOne');
  });

  it('registers apps', () => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const app = new Root();

    app.registerApp(App1, {
      regions: ['sidebar'],
    });

    expect(app.hasAppInstance('App1')).to.equal(true);
    expect(app.getAppInstance('App1').getOption('name')).to.equal('App1');
  });

  it('streams registered apps as a collection', done => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const app = new Root();

    app.registerApp(App1, {
      regions: ['sidebar'],
    });
    const apps$ = app.getApps$();

    apps$.subscribe(apps => {
      expect(Array.isArray(apps)).to.equal(true);
      expect(apps.length).to.equal(1);
      expect(apps[0].name).to.equal('App1');

      done();
    });
  });

  it('streams registered apps as a collection, with region filtering', done => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const app = new Root();

    app.registerApp(App1, {
      regions: ['sidebar'],
    });
    const apps$ = app.getApps$('sidebar');

    apps$.subscribe(apps => {
      expect(Array.isArray(apps)).to.equal(true);
      expect(apps.length).to.equal(1);
      expect(apps[0].name).to.equal('App1');

      done();
    });
  });

  it('gets app once available (that will be available in future)', done => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const root = new Root();

    root.getAppOnceAvailable$('App1')
      .subscribe(app => {
        expect(app.getName()).to.equal('App1');

        done();
      });

    root.registerApp(App1);
  });

  it('gets app once available (that is already available)', done => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const root = new Root();
    root.registerApp(App1);

    root.getAppOnceAvailable$('App1')
      .subscribe(app => {
        expect(app.getName()).to.equal('App1');

        done();
      });
  });

  it('gets app scoped by region', () => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });
    const App2 = createApp({ name: 'App2' });

    const app = new Root();
    app.registerApp(App1, {
      regions: ['sidebar'],
    });
    app.registerApp(App2, {
      regions: ['footer'],
      multi: true,
    });

    expect(app.getAppInstance('App1')).to.be.an('object');
    expect(app.getAppInstance('App1', 'sidebar')).to.be.an('object');

    expect(app.getAppInstance('App2')).to.equal(null);
    expect(app.getAppInstance('App2', 'footer')).to.equal(null);

    app.instantiateApp('App2', 'footer', 'footer-123');
    expect(app.getAppInstance('App2', 'footer', 'footer-123')).to.be.an('object');
  });

  it('throws error when registering same App twice', () => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const app = new Root();
    app.registerApp(App1);

    expect(() => {
      app.registerApp(App1);
    }).to.throw(/App 'App1' has been already registered before/);
  });

  it('checks for app instance availability', () => {
    const Root = createApp({ name: 'MyApp' });
    const App1 = createApp({ name: 'App1' });

    const app = new Root();
    expect(app.hasAppInstance('blah')).to.equal(false);

    app.registerApp(App1);
    expect(app.hasAppInstance('App1')).to.equal(true);
  });

  it('throws error when trying to instantiate non-existent App', () => {
    const Root = createApp({ name: 'MyApp' });
    const app = new Root();

    expect(() => {
      app.instantiateApp('blah');
    }).to.throw(/No app found with name 'blah'/);
  });

  it('can accept additional lifecycle callbacks for Root Apps while instantiating, without overriding', () => {
    let counter = 0;

    const Root = createApp({
      name: 'RootApp',
      initialize() {
        counter += 1;
      },
    });

    // tslint:disable-next-line:no-unused-expression
    new Root({
      initialize() {
        counter += 1;
      },
    });

    expect(counter).to.equal(2);
  });

  it('can accept additional lifecycle callbacks for Child Apps while registering, without overriding', () => {
    let counter = 0;

    const Root = createApp({
      name: 'RootApp',
    });
    const ChildApp = createApp({
      name: 'ChildApp',
      initialize() {
        counter += 1;
      },
    });

    const app = new Root();
    app.registerApp(ChildApp, {
      initialize() {
        counter += 1;
      },
    });

    expect(counter).to.equal(2);
  });

  it('can update providers at lifecycle level', () => {
    const Root = createApp({
      name: 'RootApp',
      providers: [
        {
          name: 'foo',
          useValue: 'original foo',
        },
      ],
      initialize() {
        const foo = this.get('foo');
        this.container.register({
          name: 'foo',
          useValue: `${foo} [updated]`,
        });
      }
    });

    const app = new Root();
    expect(app.get('foo')).to.equal('original foo [updated]');
  });

  it('can access and update providers from lifecycle callback defined while instantiating', () => {
    const Root = createApp({
      name: 'RootApp',
      providers: [
        {
          name: 'foo',
          useValue: 'original foo',
        },
      ],
      initialize() {
        const foo = this.get('foo');
        this.container.register({
          name: 'foo',
          useValue: `${foo} [updatedFromCreateApp]`,
        });
      }
    });

    const app = new Root({
      initialize() {
        const foo = this.get('foo');
        this.container.register({
          name: 'foo',
          useValue: `${foo} [updatedFromInstantiation]`,
        });
      }
    });

    expect(app.get('foo')).to.equal('original foo [updatedFromCreateApp] [updatedFromInstantiation]');
  });

  it('can listen for child apps registration from a provider', done => {
    const Root = createApp({
      name: 'RootApp',
      providers: [
        {
          name: '__EXEC__',
          useFactory({ app }) {
            app.getApps$().pipe(
              take(2),
              last()
            ).subscribe(appsList => {
              expect(appsList.length).to.equal(1);
              expect(appsList[0].name).to.equal('ChildApp');

              done();
            });
          },
          deps: ['app'],
        },
      ],
    });

    const Child = createApp({
      name: 'ChildApp',
    });

    const testApp = new Root();
    testApp.registerApp(Child);
  });
});
