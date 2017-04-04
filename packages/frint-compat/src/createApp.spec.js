/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it, window, beforeEach, afterEach, resetDOM */
import { expect } from 'chai';

import {
  createApp,
  createComponent,
  createFactory,
  createService,
  createModel,
} from './';

describe('frint-compat › createApp', function () {
  const TestFooService = createService({
    getName() {
      return 'TestService';
    }
  });

  const TestBarFactory = createFactory({
    getName() {
      return 'TestFactory';
    }
  });

  const TestBazModel = createModel({
    getName() {
      return this.attributes.name;
    }
  });

  const CoreApp = createApp({
    name: 'CoreAppName',
    component: true,
    enableLogger: false,
  });

  const ChildApp = createApp({
    name: 'ChildAppName',
    component: true,
    enableLogger: false,
  });

  const SecondChildApp = createApp({
    name: 'SecondChildAppName',
    component: true,
    enableLogger: false,
  });

  beforeEach(function () {
    resetDOM();
  });

  it('creates an instance', function () {
    const app = new CoreApp();

    expect(app).to.be.instanceof(CoreApp);
    expect(app.getOption('name')).to.equal('CoreAppName');
  });

  it('throws error if instantiated without name option', function () {
    const App = createApp({});
    expect(() => new App()).to.throw(/Must provide `name`/);
  });

  // NOTE: with 1.x, you can create widgets with no Component
  // it('throws error if instantiated without component option', function () {
  //   const App = createApp({ name: 'AppName' });
  //   expect(() => new App()).to.throw(/Must provide `component`/);
  // });

  it('gets root app instance from app', function () {
    window.app = new CoreApp();
    const childApp = new ChildApp();

    expect(childApp.getRootApp()).to.deep.equal(window.app);
  });

  it('gets model from self', function () {
    const app = new CoreApp({
      models: {
        baz: TestBazModel
      },
      modelAttributes: {
        baz: {
          name: 'Baz'
        }
      }
    });

    expect(app.getModel('baz').getName()).to.equal('Baz');
  });

  it('gets model from root app, when called in child app', function () {
    window.app = new CoreApp({
      models: {
        baz: TestBazModel
      },
      modelAttributes: {
        baz: {
          name: 'Baz'
        }
      }
    });

    const childApp = new ChildApp({
      parentApp: window.app,
    });

    expect(childApp.getModel('baz').getName()).to.equal('Baz');
  });

  it('fails to get non-existent model', function () {
    const app = new CoreApp();

    expect(app.getModel('blah')).to.equal(null);
  });

  it('gets factory from self', function () {
    const app = new CoreApp({
      factories: {
        bar: TestBarFactory
      }
    });

    expect(app.getFactory('bar').getName()).to.equal('TestFactory');
  });

  it('gets factory from root app, when called in child app', function () {
    window.app = new CoreApp({
      factories: {
        bar: TestBarFactory
      }
    });

    const childApp = new ChildApp({
      parentApp: window.app,
    });

    expect(childApp.getFactory('bar').getName()).to.equal('TestFactory');
  });

  it('fails to get factory from non-existent root app, when called in child app', function () {
    const childApp = new ChildApp();

    expect(childApp.getFactory('blah')).to.equal(null);
  });

  it('fails to get non-existent factory in both child app and root, when called in child app', function () {
    window.app = new CoreApp();
    const childApp = new ChildApp();

    expect(childApp.getFactory('hello')).to.equal(null);
  });

  it('gets service from self', function () {
    const app = new CoreApp({
      services: {
        foo: TestFooService
      }
    });

    expect(app.getService('foo').getName()).to.equal('TestService');
  });

  it('gets service from root app, when called in child app', function () {
    window.app = new CoreApp({
      services: {
        foo: TestFooService
      }
    });

    const childApp = new ChildApp({
      parentApp: window.app,
    });

    expect(childApp.getService('foo').getName()).to.equal('TestService');
  });

  it('fails to get service from non-existent root app, when called in child app', function () {
    window.app = new CoreApp();

    const childApp = new ChildApp();

    expect(childApp.getService('blah')).to.equal(null);
  });

  // NOTE: previously deprecated in 0.x, hence removed
  // it('creates store', function () {
  //   const app = new CoreApp({
  //     initialState: {
  //       hello: 'world'
  //     }
  //   });

  //   const store = app.createStore(() => {}, {});
  //   expect(store.subscribe).to.be.a('function');
  // });

  it('gets store', function () {
    const app = new CoreApp({
      initialState: {
        hello: 'world'
      }
    });

    const store = app.getStore();
    expect(store.subscribe).to.be.a('function');
  });

  it('fails to get store of non-existent app', function () {
    window.app = new CoreApp({
      initialState: {
        hello: 'world'
      }
    });

    const store = window.app.getStore('iDontExist');
    expect(store).to.equal(null);
  });

  // NOTE: removed, since it was deprecated in 0.x already
  // it('observes widgets', function () {
  //   const app = new CoreApp({
  //     initialState: {
  //       hello: 'world'
  //     }
  //   });

  //   const observe$ = app.observeWidgets();
  //   expect(isObservable(observe$)).to.equal(true);
  // });

  it('gets state for self', function (done) {
    const app = new CoreApp({
      initialState: {
        hello: 'world'
      }
    });

    app.getState$()
      .subscribe(function (state) {
        expect(state).to.deep.equal({ hello: 'world' });

        done();
      });
  });

  it('gets state of another app, from root', function (done) {
    window.app = new CoreApp();

    const childApp = new ChildApp({
      initialState: {
        childApp1: 'childApp1',
      },
    });

    childApp.setRegion('sidebar');

    window.app.getState$('ChildAppName')
      .subscribe(function (state) {
        expect(state).to.deep.equal({ childApp1: 'childApp1' });

        done();
      });
  });

  it('gets state of another app, from a child app', function (done) {
    window.app = new CoreApp();

    const childApp = new ChildApp({
      initialState: {
        childApp1: 'childApp1'
      }
    });

    childApp.setRegion('sidebar');

    const secondApp = new SecondChildApp({
      initialState: {
        childApp2: 'childApp2'
      }
    });

    secondApp.setRegion('footer');

    // ChildApp1 reading state of ChildApp2
    childApp.getState$('SecondChildAppName')
      .subscribe(function (state) {
        expect(state).to.deep.equal({ childApp2: 'childApp2' });

        done();
      });
  });

  it('returns null when no state is found', function () {
    window.app = new CoreApp();

    expect(window.app.getState$('blah')).to.equal(null);
  });

  it('sets multiple regions for an app', function () {
    window.app = new CoreApp();

    const childApp = new ChildApp();

    childApp.setRegions(['header', 'footer']);

    expect(window.app.getWidgets('header')).to.deep.equal([childApp]);
    expect(window.app.getWidgets('footer')).to.deep.equal([childApp]);
  });

  it('triggers beforeUnmount as passed in option', function () {
    let foo;

    window.app = new CoreApp({
      beforeUnmount() {
        foo = 'bar';
      }
    });

    window.app.beforeUnmount();
    expect(foo).to.equal('bar');
  });

  // NOTE: setRegion will never be called in v1.x
  // it('throws error if setRegion is called without a root app', function () {
  //   const widget = new WidgetApp();

  //   expect(() => widget.setRegion('sidebar')).to.throw(/No root app instance available/);
  // });

  it('throws error if wrong Model class is given', function () {
    expect(function () {
      new CoreApp({ // eslint-disable-line
        models: {
          baz: 'baz'
        }
      });
    }).to.throw(/Expected model class 'baz' to be a valid Model class/);
  });

  it.skip('spreads "render" argument as Component properties', function () {
    const props = {
      frint: true,
      coolness: 100,
    };

    const App = createApp({
      component: createComponent({
        render() {},
      }),
      name: 'name',
    });

    const provider = new App().render(props);

    const component = provider().props.children;
    expect(component.props).to.be.eql(props);
  });
});
