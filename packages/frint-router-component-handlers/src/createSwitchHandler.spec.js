/* eslint-disable import/no-extraneous-dependencies, func-names, no-unused-expressions */
/* global describe, it */
import { expect } from 'chai';

import { MemoryRouterService } from 'frint-router';
import createSwitchHandler from './createSwitchHandler';
import { ComponentHandler, createTestAppInstance, createComponent } from './testHelpers';

describe('frint-router-component-handlers › createSwitchHandler', function () {
  it('creates a handler with getInitialData, beforeMount, beforeDestroy, getMatch methods', function () {
    const handler = createSwitchHandler(
      ComponentHandler,
      createTestAppInstance(new MemoryRouterService()),
      createComponent()
    );

    expect(handler).to.include.all.keys('getInitialData', 'beforeMount', 'beforeDestroy', 'getMatch');
  });

  it('when getInitialData is called, it returns object with history key', function () {
    const handler = createSwitchHandler(
      ComponentHandler,
      createTestAppInstance(new MemoryRouterService()),
      createComponent()
    );

    const data = handler.getInitialData();
    expect(data).to.be.an('object');
    expect(data).to.have.all.keys('history');
  });

  describe('SwitchHandler functions properly throughout lifecycle', function () {
    const router = new MemoryRouterService();
    const component = createComponent();

    const handler = createSwitchHandler(
      ComponentHandler,
      createTestAppInstance(router),
      component
    );

    component.data = handler.getInitialData();

    it('initially history is set to null', function () {
      expect(component.data.history).to.be.null;
    });

    it('when beforeMount is called, it subscribes to the router and changes history data whenever it changes in router', function () {
      handler.beforeMount();

      const history1 = component.data.history;
      expect(history1).to.not.be.null;

      router.push('/contact');

      const history2 = component.data.history;
      expect(history2).to.not.be.null;
      expect(history2).to.not.equal(history1);
    });

    it('when getMatch is called, it matches history correctly from the router', function () {
      router.push('/about');

      expect(handler.getMatch('/', true)).to.be.null;
      expect(handler.getMatch('/', false)).to.be.an('object');
      expect(handler.getMatch('/about', true)).to.be.an('object');
      expect(handler.getMatch('/about', false)).to.be.an('object');
    });

    it('when beforeDestroy() is called, it unsubscribes from router and history data no longer changes', function () {
      handler.beforeDestroy();

      const history1 = component.data.history;

      router.push('/destroyed');

      const history2 = component.data.history;
      expect(history2).to.equal(history1);
    });
  });
});
