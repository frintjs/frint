/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import composeHandlers from './composeHandlers';

describe('frint-component-utils › composeHandlers', function () {
  it('is a function', function () {
    expect(composeHandlers).to.be.a('function');
  });

  it('composes with default options', function () {
    const handler = composeHandlers();

    expect(handler.beforeMount).to.be.a('function');
    expect(handler.afterMount).to.be.a('function');
  });

  it('composes by overriding default handler', function () {
    const handler = composeHandlers({
      counter: 0,
      increment() {
        this.counter = this.counter + 1;
      },
      beforeMount() {
        this.increment();
        return 'beforeMount';
      },
      someOtherMethod() {
        this.increment();
        return 'someOtherMethod';
      },
      getCounter() {
        return this.counter;
      }
    });

    expect(handler.beforeMount()).to.equal('beforeMount');
    expect(handler.someOtherMethod()).to.equal('someOtherMethod');
    expect(handler.counter).to.equal(2);
    expect(handler.getCounter()).to.equal(2);
  });

  it('composes with multiple handlers', function () {
    const firstHandler = {
      counter: 0,
      increment() {
        this.counter = this.counter + 1;
      },
      beforeMount() {
        this.increment();
        return 'beforeMount';
      },
      someOtherMethod() {
        this.increment();
        return 'someOtherMethod';
      },
      getCounter() {
        return this.counter;
      }
    };

    const secondHandler = {
      increment() {
        this.counter = this.counter + 2;
      }
    };

    const handlerInstance = composeHandlers(
      firstHandler,
      secondHandler
    );

    expect(handlerInstance.beforeMount()).to.equal('beforeMount');
    expect(handlerInstance.someOtherMethod()).to.equal('someOtherMethod');
    expect(handlerInstance.counter).to.equal(4);
    expect(handlerInstance.getCounter()).to.equal(4);

    const anotherHandlerInstance = composeHandlers(firstHandler, secondHandler);
    expect(anotherHandlerInstance.counter).to.equal(0);

    expect(handlerInstance.counter).to.equal(4);
  });
});
