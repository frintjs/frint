/* eslint-disable import/no-extraneous-dependencies, func-names, no-unused-expressions */
/* global describe, it */
import { expect } from 'chai';

import { MemoryRouterService } from 'frint-router';
import createRouteHandler from './createRouteHandler';
import { ComponentHandler, createTestAppInstance, createTestApp, createComponent } from './testHelpers';

describe('frint-router-component-handlers › createRouteHandler', function () {
  it('creates a handler with getInitialData, beforeMount, propsChange, beforeDestroy methods', function () {
    const handler = createRouteHandler(
      ComponentHandler,
      createTestAppInstance(new MemoryRouterService()),
      createComponent()
    );

    expect(handler).to.include.all.keys('getInitialData', 'beforeMount', 'propsChange', 'beforeDestroy');
  });

  it('throws exception when ComponentHandler doesn\'t have getMountableComponent() method', function () {
    const invalidCreation = () => {
      createRouteHandler(
        {},
        createTestAppInstance(new MemoryRouterService()),
        createComponent()
      );
    };

    expect(invalidCreation).to.throw(Error, 'ComponentHandler must provide getMountableComponent() method');
  });

  describe('RouteHandler functions properly throughout lifecycle', function () {
    const router = new MemoryRouterService();

    const component = createComponent();
    const componentToRender = createComponent();
    component.props = {
      path: '/products',
      exact: true,
      component: componentToRender
    };

    const handler = createRouteHandler(
      ComponentHandler,
      createTestAppInstance(router),
      component
    );

    it('initially component and matched data are set to null', function () {
      component.data = handler.getInitialData();

      expect(component.data.component).to.be.null;
      expect(component.data.matched).to.be.null;
    });

    it('when beforeMount() is called it subscribes to router and changes matched and component accordingly', function () {
      handler.beforeMount();

      expect(component.data.matched).to.be.null;
      expect(component.data.component).to.equal(componentToRender);

      router.push('/products');

      expect(component.data.matched).to.be.an('object');
    });

    it('when component and app props changed and propsChange() is called, component data is set to app\'s component', function () {
      const appComponent = createComponent();
      component.props.component = undefined;

      component.props.app = createTestApp(undefined, appComponent);

      handler.propsChange(component.props, false, false, true);

      expect(component.data.component).to.deep.equal(appComponent);
    });

    it('when path prop change and propsChange() is called, matched data is changed', function () {
      expect(component.data.matched).to.be.an('object');

      component.props.path = '/contact';
      handler.propsChange(component.props, true, false, false);

      expect(component.data.matched).to.be.null;
    });

    it('when beforeDestroy() is called, it unsubscribes from router and matched no longer changes', function () {
      expect(component.data.matched).to.be.null;

      handler.beforeDestroy();
      router.push('/contact');

      expect(component.data.matched).to.be.null;
    });
  });

  describe('RouteHandler functions properly with render() throughout lifecycle', function () {
    const router = new MemoryRouterService();

    const component = createComponent();
    const componentToRender = createComponent();

    component.props = {
      path: '/',
      exact: true,
      render: function () {
        /* istanbul ignore next */
        return null;
      }
    };

    const handler = createRouteHandler(
      ComponentHandler,
      createTestAppInstance(router),
      component
    );

    router.push('/');

    it('initially component data is set to null', function () {
      component.data = handler.getInitialData();

      expect(component.data.component).to.be.null;
    });

    it('when component prop is set, component data keeps null value', function () {
      component.props.component = componentToRender;
      handler.propsChange(component.props, false, false, false);

      expect(component.data.component).to.be.null;
    });

    it('when render() prop is removed, component data is equal to component prop', function () {
      component.props.render = undefined;
      handler.propsChange(component.props, false, false, false);

      expect(component.data.component).to.equal(componentToRender);
    });

    it('when render() prop is set and component prop removed, component data equals to null', function () {
      component.props.component = undefined;
      component.props.render = () => null;
      handler.propsChange(component.props, false, false, false);

      expect(component.data.component).to.be.null;
    });
  });

  describe('RouteHandler functions properly with computedMatch throughout lifecycle', function () {
    const router = new MemoryRouterService();

    const component = createComponent();
    const componentToRender = createComponent();
    const computedMatch = {};

    component.props = {
      path: '/products',
      exact: true,
      computedMatch,
      component: componentToRender
    };

    const handler = createRouteHandler(
      ComponentHandler,
      createTestAppInstance(router),
      component
    );

    router.push('/');

    it('initially matched data is set to null', function () {
      component.data = handler.getInitialData();

      expect(component.data.matched).to.be.null;
    });

    it('when beforeMount() is called it doesn\'t subscribe to router and therefore matched data is not affected', function () {
      expect(component.data.matched).to.be.null;

      handler.beforeMount();

      router.push('/products');

      expect(component.data.matched).to.be.null;
    });

    it('when computedMatch prop is removed and propChanged() is called it subscribes to router and therefore matched data is affected', function () {
      component.props.computedMatch = null;
      handler.propsChange(component.props, false, false, false);

      expect(component.data.matched).to.be.an('object');
    });
  });
});
