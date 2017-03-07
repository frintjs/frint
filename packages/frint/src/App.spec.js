/* eslint-disable import/no-extraneous-dependencies, func-names, no-new, class-methods-use-this*/
/* global describe, it */
import { expect } from 'chai';

import App from './App';
import createApp from './createApp';

describe('frint  › App', function () {
  it('throws error when creating new instance without name', function () {
    expect(() => {
      new App();
    }).to.throw(/Must provide `name` in options/);
  });

  it('gets option value', function () {
    const app = new App({
      name: 'MyApp',
    });

    expect(app.getOption('name')).to.equal('MyApp');
  });

  it('registers providers with direct values', function () {
    const app = new App({
      name: 'MyApp',
      providers: [
        { name: 'foo', useValue: 'fooValue' },
      ],
    });

    expect(app.get('foo')).to.equal('fooValue');
  });

  it('registers providers with factory values', function () {
    const app = new App({
      name: 'MyApp',
      providers: [
        { name: 'foo', useFactory: () => 'fooValue' },
      ],
    });

    expect(app.get('foo')).to.equal('fooValue');
  });

  it('registers providers with class values', function () {
    class Foo {
      getValue() {
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

  it('registers providers with dependencies', function () {
    class Baz {
      constructor({ foo, bar }) {
        this.foo = foo;
        this.bar = bar;
      }

      getValue() {
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

  it('returns services from Core that are cascaded', function () {
    class ServiceC {
      getValue() {
        return 'serviceC';
      }
    }

    const Core = createApp({
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
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();
    app.registerWidget(Widget1);

    const widget = app.getWidgetInstance('Widget1');
    expect(widget.get('serviceA')).to.equal('serviceA');
    expect(widget.get('serviceB')).to.equal('serviceB');
    expect(widget.get('serviceC').getValue()).to.equal('serviceC');
    expect(widget.get('serviceD')).to.equal(null);
    expect(widget.get('serviceE')).to.equal('serviceE');

    expect(widget.get('serviceF')).to.equal(null);
    expect(app.get('serviceF')).to.equal(null);
  });

  it('returns null when service is non-existent in both Widget and Core', function () {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();
    app.registerWidget(Widget1);

    const serviceA = app
      .getWidgetInstance('Widget1')
      .get('serviceA');

    expect(serviceA).to.equal(null);
  });

  it('gets container', function () {
    const app = new App({
      name: 'MyApp'
    });

    expect(app.getContainer()).to.deep.equal(app.container);
  });

  it('gets providers definition list', function () {
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

  it('gets individual provider definition', function () {
    const app = new App({
      name: 'MyApp',
      providers: [
        { name: 'foo', useValue: 'fooValue' },
      ],
    });

    expect(app.getProvider('foo')).to.deep.equal({ name: 'foo', useValue: 'fooValue' });
  });

  it('calls initialize during construction, as passed in options', function () {
    let called = false;

    const app = new App({
      name: 'MyApp',
      initialize() {
        called = true;
      }
    });

    expect(app.getOption('name')).to.equal('MyApp');
    expect(called).to.equal(true);
  });

  it('registers widgets', function () {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();

    app.registerWidget(Widget1, {
      regions: ['sidebar'],
    });

    expect(app.hasWidgetInstance('Widget1')).to.equal(true);
    expect(app.getWidgetInstance('Widget1').getOption('name')).to.equal('Widget1');
  });

  it('registers widgets, by overriding options', function () {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();

    app.registerWidget(Widget1, {
      name: 'WidgetOne',
      regions: ['sidebar'],
    });

    expect(app.hasWidgetInstance('WidgetOne')).to.equal(true);
    expect(app.getWidgetInstance('WidgetOne').getOption('name')).to.equal('WidgetOne');
  });

  it('registers widgets', function () {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();

    app.registerWidget(Widget1, {
      regions: ['sidebar'],
    });

    expect(app.hasWidgetInstance('Widget1')).to.equal(true);
    expect(app.getWidgetInstance('Widget1').getOption('name')).to.equal('Widget1');
  });

  it('streams registered widgets as a collection', function (done) {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();

    app.registerWidget(Widget1, {
      regions: ['sidebar'],
    });
    const widgets$ = app.getWidgets$();

    widgets$.subscribe(function (widgets) {
      expect(Array.isArray(widgets)).to.equal(true);
      expect(widgets.length).to.equal(1);
      expect(widgets[0].name).to.equal('Widget1');

      done();
    });
  });

  it('streams registered widgets as a collection, with region filtering', function (done) {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();

    app.registerWidget(Widget1, {
      regions: ['sidebar'],
    });
    const widgets$ = app.getWidgets$('sidebar');

    widgets$.subscribe(function (widgets) {
      expect(Array.isArray(widgets)).to.equal(true);
      expect(widgets.length).to.equal(1);
      expect(widgets[0].name).to.equal('Widget1');

      done();
    });
  });

  it('gets widget once available (that will be available in future)', function (done) {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();

    app.getWidgetOnceAvailable$('Widget1')
      .subscribe(function (widget) {
        expect(widget.getOption('name')).to.equal('Widget1');

        done();
      });

    app.registerWidget(Widget1);
  });

  it('gets widget once available (that is already available)', function (done) {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();
    app.registerWidget(Widget1);

    app.getWidgetOnceAvailable$('Widget1')
      .subscribe(function (widget) {
        expect(widget.getOption('name')).to.equal('Widget1');

        done();
      });
  });

  it('gets widget scoped by region', function () {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });
    const Widget2 = createApp({ name: 'Widget2' });

    const app = new Core();
    app.registerWidget(Widget1, {
      regions: ['sidebar'],
    });
    app.registerWidget(Widget2, {
      regions: ['footer'],
      multi: true,
    });

    expect(app.getWidgetInstance('Widget1')).to.be.an('object');
    expect(app.getWidgetInstance('Widget1', 'sidebar')).to.be.an('object');

    expect(app.getWidgetInstance('Widget2')).to.equal(null);
    expect(app.getWidgetInstance('Widget2', 'footer')).to.equal(null);

    app.instantiateWidget('Widget2', 'footer', 'footer-123');
    expect(app.getWidgetInstance('Widget2', 'footer', 'footer-123')).to.be.an('object');
  });

  it('throws error when registering same Widget twice', function () {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();
    app.registerWidget(Widget1);

    expect(() => {
      app.registerWidget(Widget1);
    }).to.throw(/Widget 'Widget1' has been already registered before/);
  });

  it('checks for widget instance availability', function () {
    const Core = createApp({ name: 'MyApp' });
    const Widget1 = createApp({ name: 'Widget1' });

    const app = new Core();
    expect(app.hasWidgetInstance('blah')).to.equal(false);

    app.registerWidget(Widget1);
    expect(app.hasWidgetInstance('Widget1')).to.equal(true);
  });

  it('throws error when trying to instantiate non-existent Widget', function () {
    const Core = createApp({ name: 'MyApp' });
    const app = new Core();

    expect(() => {
      app.instantiateWidget('blah');
    }).to.throw(/No widget found with name 'blah'/);
  });
});
