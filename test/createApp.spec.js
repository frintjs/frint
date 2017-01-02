/* global describe, it, window, beforeEach, resetDOM */
import { expect } from 'chai';

import {
  createApp,
  createFactory,
  createService,
  createModel,
  isObservable,
} from '../src';

describe('createApp', function () {
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

  const WidgetApp = createApp({
    name: 'WidgetAppName',
    component: true,
    enableLogger: false,
  });

  const SecondWidgetApp = createApp({
    name: 'SecondWidgetAppName',
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

  it('throws error if instantiated without component option', function () {
    const App = createApp({ name: 'AppName' });
    expect(() => new App()).to.throw(/Must provide `component`/);
  });

  it('gets root app instance from widget', function () {
    window.app = new CoreApp();
    const widget = new WidgetApp();

    expect(widget.getRootApp()).to.deep.equal(window.app);
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

  it('gets model from root app, when called in widget', function () {
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

    const widget = new WidgetApp();

    expect(widget.getModel('baz').getName()).to.equal('Baz');
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

  it('gets factory from root app, when called in widget', function () {
    window.app = new CoreApp({
      factories: {
        bar: TestBarFactory
      }
    });

    const widget = new WidgetApp();

    expect(widget.getFactory('bar').getName()).to.equal('TestFactory');
  });

  it('fails to get factory from non-existent root app, when called in widget', function () {
    const widget = new WidgetApp();

    expect(widget.getFactory('blah')).to.equal(null);
  });

  it('fails to get non-existent factory in both widget and root, when called in widget', function () {
    window.app = new CoreApp();
    const widget = new WidgetApp();

    expect(widget.getFactory('hello')).to.equal(null);
  });

  it('gets service from self', function () {
    const app = new CoreApp({
      services: {
        foo: TestFooService
      }
    });

    expect(app.getService('foo').getName()).to.equal('TestService');
  });

  it('gets service from root app, when called in widget', function () {
    window.app = new CoreApp({
      services: {
        foo: TestFooService
      }
    });

    const widget = new WidgetApp();

    expect(widget.getService('foo').getName()).to.equal('TestService');
  });

  it('fails to get service from non-existent root app, when called in widget', function () {
    window.app = new CoreApp();

    const widget = new WidgetApp();

    expect(widget.getService('blah')).to.equal(null);
  });

  it('creates store', function () {
    const app = new CoreApp({
      initialState: {
        hello: 'world'
      }
    });

    const store = app.createStore(() => {}, {});
    expect(store.subscribe).to.be.a('function');
  });

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

  it('observes widgets', function () {
    const app = new CoreApp({
      initialState: {
        hello: 'world'
      }
    });

    const observe$ = app.observeWidgets();
    expect(isObservable(observe$)).to.equal(true);
  });

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

  it('gets state of another widget, from root', function (done) {
    window.app = new CoreApp();

    const widget = new WidgetApp({
      initialState: {
        widget1: 'widget1'
      }
    });

    widget.setRegion('sidebar');

    window.app.getState$('WidgetAppName')
      .subscribe(function (state) {
        expect(state).to.deep.equal({ widget1: 'widget1' });

        done();
      });
  });

  it('gets state of another widget, from a widget', function (done) {
    window.app = new CoreApp();

    const widget = new WidgetApp({
      initialState: {
        widget1: 'widget1'
      }
    });

    widget.setRegion('sidebar');

    const secondWidget = new SecondWidgetApp({
      initialState: {
        widget2: 'widget2'
      }
    });

    secondWidget.setRegion('footer');

    // Widget1 reading state of Widget2
    widget.getState$('SecondWidgetAppName')
      .subscribe(function (state) {
        expect(state).to.deep.equal({ widget2: 'widget2' });

        done();
      });
  });

  it('returns null when no state is found', function () {
    window.app = new CoreApp();

    expect(window.app.getState$('blah')).to.equal(null);
  });

  it('sets multiple regions for a widget', function () {
    window.app = new CoreApp();

    const widget = new WidgetApp();

    widget.setRegions(['header', 'footer']);

    expect(window.app.getWidgets('header')).to.deep.equal([widget]);
    expect(window.app.getWidgets('footer')).to.deep.equal([widget]);
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

  it('throws error if setRegion is called without a root app', function () {
    const widget = new WidgetApp();

    expect(() => widget.setRegion('sidebar')).to.throw(/No root app instance available/);
  });

  it('throws error if wrong Model class is given', function () {
    expect(function () {
      new CoreApp({ // eslint-disable-line
        models: {
          baz: 'baz'
        }
      });
    }).to.throw(/Expected model class 'baz' to be a valid Model class/);
  });
});
