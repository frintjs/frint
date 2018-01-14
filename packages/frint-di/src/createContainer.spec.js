/* eslint-disable import/no-extraneous-dependencies, func-names, class-methods-use-this */
/* global describe, it */
import { expect } from 'chai';

import createClass from '../src/createClass';
import createContainer from '../src/createContainer';
import resolveContainer from '../src/resolveContainer';

describe('createContainer', function () {
  it('creates Container with direct vaules', function () {
    const Container = createContainer([
      { name: 'foo', useValue: 'foo value' },
      { name: 'bar', useValue: 'bar value' },
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo')).to.equal('foo value');
    expect(container.get('bar')).to.equal('bar value');
  });

  it('creates Container with values coming from factories', function () {
    const Container = createContainer([
      { name: 'foo', useFactory: () => 'foo value' },
      { name: 'bar', useFactory: () => 'bar value' },
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo')).to.equal('foo value');
    expect(container.get('bar')).to.equal('bar value');
  });

  it('creates Container with values coming from ES6 classes', function () {
    class Foo {
      text() {
        return 'foo value';
      }
    }

    class Bar {
      text() {
        return 'bar value';
      }
    }

    const Container = createContainer([
      { name: 'foo', useClass: Foo },
      { name: 'bar', useClass: Bar },
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo').text()).to.equal('foo value');
    expect(container.get('bar').text()).to.equal('bar value');
  });

  it('creates Container with values coming from ES5 classes, created by createClass', function () {
    const Foo = createClass({
      text() {
        return 'foo value';
      }
    });

    const Bar = createClass({
      text() {
        return 'bar value';
      }
    });

    const Container = createContainer([
      { name: 'foo', useClass: Foo },
      { name: 'bar', useClass: Bar },
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo').text()).to.equal('foo value');
    expect(container.get('bar').text()).to.equal('bar value');
  });

  it('creates Container with providers having dependencies, defined as an array', function () {
    class Foo {
      text() {
        return 'foo value';
      }
    }

    class Bar {
      constructor({ foo }) {
        this.foo = foo;
      }

      text() {
        return 'bar value';
      }

      fooText() {
        return this.foo.text();
      }
    }

    const Container = createContainer([
      { name: 'foo', useClass: Foo },
      { name: 'bar', useClass: Bar, deps: ['foo'] },
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo').text()).to.equal('foo value');
    expect(container.get('bar').text()).to.equal('bar value');
    expect(container.get('bar').fooText()).to.equal('foo value');
  });

  it('creates Container with providers having dependencies, defined as an object', function () {
    class Foo {
      text() {
        return 'foo value';
      }
    }

    class Bar {
      constructor({ myFoo }) {
        this.myFoo = myFoo;
      }

      text() {
        return 'bar value';
      }

      fooText() {
        return this.myFoo.text();
      }
    }

    const Container = createContainer([
      { name: 'foo', useClass: Foo },
      {
        name: 'bar',
        useClass: Bar,
        deps: {
          foo: 'myFoo',
        },
      },
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo').text()).to.equal('foo value');
    expect(container.get('bar').text()).to.equal('bar value');
    expect(container.get('bar').fooText()).to.equal('foo value');
  });

  it('creates Container with values coming from factories, by passing dependencies', function () {
    const Container = createContainer([
      { name: 'foo', useFactory: () => 'foo value' },
      {
        name: 'bar',
        useFactory: ({ foo }) => {
          return `bar value, ${foo}`;
        },
        deps: ['foo'],
      },
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo')).to.equal('foo value');
    expect(container.get('bar')).to.equal('bar value, foo value');
  });

  it('gets self by container key name', function () {
    const Container = createContainer([
      { name: 'foo', useFactory: () => 'foo value' },
    ]);

    const container = resolveContainer(Container);

    expect(container.get('foo')).to.equal('foo value');
    expect(container.get('container')).to.deep.equal(container);
  });


  it('gets self by custom container key name', function () {
    const Container = createContainer([
      { name: 'foo', useFactory: () => 'foo value' },
    ], {
      containerName: 'customContainerName',
    });

    const container = resolveContainer(Container);

    expect(container.get('foo')).to.equal('foo value');
    expect(container.get('customContainerName')).to.deep.equal(container);
  });
});
