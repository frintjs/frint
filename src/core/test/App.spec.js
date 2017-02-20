/* global describe, it */
/* eslint-disable no-new, class-methods-use-this */
import { expect } from 'chai';

import App from '../App';

describe('core  › App', function () {
  it('throws error when creating new instance withour name', function () {
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

    expect(called).to.equal(true);
  });

  it('calls beforeMount, as passed in options', function () {
    let called = false;

    const app = new App({
      name: 'MyApp',
      beforeMount() {
        called = true;
      }
    });

    app.beforeMount();
    expect(called).to.equal(true);
  });

  it('calls afterMount, as passed in options', function () {
    let called = false;

    const app = new App({
      name: 'MyApp',
      afterMount() {
        called = true;
      }
    });

    app.afterMount();
    expect(called).to.equal(true);
  });


  it('calls beforeUnmount, as passed in options', function () {
    let called = false;

    const app = new App({
      name: 'MyApp',
      beforeUnmount() {
        called = true;
      }
    });

    app.beforeUnmount();
    expect(called).to.equal(true);
  });
});
