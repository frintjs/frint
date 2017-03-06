/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it, before, beforeEach, afterEach */
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import Frint from 'frint';

import extendApp from './extendApp';

chai.use(chaiEnzyme());

describe('compat › extendApp', function () {
  const { App } = Frint;

  it('is a function', () => {
    expect(extendApp).to.be.a('function');
  });

  it('expects one argument', () => {
    expect(extendApp.length).to.be.equal(3);
  });

  it('App must be a function', () => {
    expect(() => extendApp({})).to.throw(/undefined/);
  });

  const hooks = ['beforeMount', 'afterMount', 'beforeUnmount'];
  describe(`hooks: ${hooks.join(', ')}`, () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
      sandbox.reset();
    });

    hooks.forEach((hook) => {
      it(`introduces "${hook}" function`, () => {
        expect(App.prototype[hook]).to.be.a('function');
      });

      it(`"${hook}" is called with proper arguments`, () => {
        const args = ['a', 'b', 'c'];
        const app = new App({
          name: 'TestApp',
          [hook]: sinon.stub()
        });

        app[hook](...args);
        sinon.assert.calledWith(app.options[hook], ...args);
      });

      it(`does not break if "${hook}" is not defined in "options"`, () => {
        const app = new App({
          name: 'TestApp'
        });
        app[hook]();
      });

      it(`caches "${hook}" on resolution`, () => {
        const hookSpy = sandbox.spy(App.prototype, hook);

        const app = new App({
          name: 'TestApp',
          [hook]: sinon.stub()
        });

        app[hook](); // this should call the hookSpy
        app[hook](); // second call, it should call directly the stub (cache)

        sinon.assert.callCount(hookSpy, 1);
        sinon.assert.callCount(app.options[hook], 2);
      });
    });
  });
});
