/* eslint-disable import/no-extraneous-dependencies, func-names, no-unused-expressions */
/* global describe, it */
import { expect } from 'chai';

import { MemoryRouterService } from 'frint-router';
import createLinkHandler from './createLinkHandler';
import { ComponentHandler, createTestAppInstance, createComponent } from './testHelpers';

describe('frint-router-component-handlers › createLinkHandler', function () {
  it('creates a handler with getInitialData, beforeMount, propsChange, handleClick, beforeDestroy methods', function () {
    const handler = createLinkHandler(
      ComponentHandler,
      createTestAppInstance(new MemoryRouterService()),
      createComponent()
    );

    expect(handler).to.include.all.keys('getInitialData', 'beforeMount', 'propsChange', 'handleClick', 'beforeDestroy');
  });

  describe('LinkHandler functions properly throughout lifecycle', function () {
    const router = new MemoryRouterService();

    const component = createComponent();
    component.props.to = '/about';
    component.props.exact = false;
    component.props.activeClassName = 'active-link';

    const handler = createLinkHandler(
      ComponentHandler,
      createTestAppInstance(router),
      component
    );

    it('when getInitialData() called, it returns object with active key', function () {
      component.data = handler.getInitialData();
      expect(component.data).to.have.all.keys({ active: false });
    });

    it('when beforeMount() called, subscribes to router and changes active data accordingly', function () {
      handler.beforeMount();
      expect(component.data.active).to.be.false;

      router.push('/about');

      expect(component.data.active).to.be.true;
    });

    it('when props change and propsChange() called, it resubscribes to router and changes active data accordingly', function () {
      component.props.to = '/contact';
      handler.propsChange(component.props, true, false);

      expect(component.data.active).to.be.false;

      router.push('/contact/us');
      expect(component.data.active).to.be.true;
    });

    it('when handleClick() is called, it changes router url', function () {
      expect(router.getLocation().pathname).to.equal('/contact/us');

      handler.handleClick();

      expect(router.getLocation().pathname).to.equal('/contact');
    });

    it('when beforeDestroy() is called, unsubscribes from router and doesn\'t change active data anymore', function () {
      expect(component.data.active).to.be.true;

      handler.beforeDestroy();
      router.push('/random');
      expect(component.data.active).to.be.true;
    });
  });
});
