/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it, before, resetDOM */
import { expect } from 'chai';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouterService } from 'frint-router';

import Link from './Link';

function createContextWithRouter(router) {
  return {
    app: {
      get(key) {
        if (key === 'router') {
          return router;
        }

        return null;
      }
    }
  };
}

describe('frint-route-react › Link', () => {
  before(function () {
    resetDOM();
  });

  it('renders anchor with href, className and children when no type prop is passed', () => {
    const linkContent = <span className="decorated">About</span>;

    const wrapper = shallow(
      <Link className="anchor" to="/about">{linkContent}</Link>,
      { context: createContextWithRouter() }
    );

    expect(wrapper.name()).to.equal('a');
    expect(wrapper.hasClass('anchor')).to.be.true; // eslint-disable-line no-unused-expressions

    expect(wrapper.children().length).to.equal(1);
    expect(wrapper.children().get(0)).to.equal(linkContent);
  });

  it('renders button with type, className and children when type prop is passed', () => {
    const linkContent = <span className="decorated">About</span>;

    const wrapper = shallow(
      <Link className="fancy-button" to="/about" type="button">{linkContent}</Link>,
      { context: { app: {} } }
    );

    expect(wrapper.name()).to.equal('button');
    expect(wrapper.prop('type')).to.equal('button');
    expect(wrapper.hasClass('fancy-button')).to.be.true; // eslint-disable-line no-unused-expressions

    expect(wrapper.children().length).to.equal(1);
    expect(wrapper.children().get(0)).to.equal(linkContent);
  });

  it('subscribes to router service for  matching route inexactly and changes activeClass accordingly ' +
    'when activeClassName is passed', () => {
    const router = new MemoryRouterService();

    const wrapper = mount(
      <Link
        activeClassName="anchor-active"
        className="anchor"
        to="/about"
      >
        About
      </Link>,
      { context: createContextWithRouter(router) }
    );

    router.push('/');
    expect(wrapper.hasClass('anchor')).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.hasClass('anchor-active')).to.be.false; // eslint-disable-line no-unused-expressions

    router.push('/about');
    expect(wrapper.hasClass('anchor')).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.hasClass('anchor-active')).to.be.true; // eslint-disable-line no-unused-expressions

    router.push('/about/whatever');
    expect(wrapper.hasClass('anchor')).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.hasClass('anchor-active')).to.be.true; // eslint-disable-line no-unused-expressions

    router.push('/');
    expect(wrapper.hasClass('anchor')).to.be.true; // eslint-disable-line no-unused-expressions
    expect(wrapper.hasClass('anchor-active')).to.be.false; // eslint-disable-line no-unused-expressions
  });

  it('subscribes to router service for exactly matching route and changes activeClass accordingly ' +
    'when activeClassName and exact is passed', () => {
    const router = new MemoryRouterService();

    const wrapper = mount(
      <Link
        activeClassName="anchor-active"
        className="anchor"
        exact
        to="/about"
      >
        About
      </Link>,
      { context: createContextWithRouter(router) }
    );

    router.push('/');
    expect(wrapper.hasClass('anchor-active')).to.be.false; // eslint-disable-line no-unused-expressions

    router.push('/about');
    expect(wrapper.hasClass('anchor-active')).to.be.true; // eslint-disable-line no-unused-expressions

    router.push('/about/whatever');
    expect(wrapper.hasClass('anchor-active')).to.be.false; // eslint-disable-line no-unused-expressions

    router.push('/');
    expect(wrapper.hasClass('anchor-active')).to.be.false; // eslint-disable-line no-unused-expressions
  });


  it('subscribes to router service for matching route and changes activeClass accordingly ' +
    'even when activeClassName is passed later on', () => {
    const router = new MemoryRouterService();

    const wrapper = mount(
      <Link
        className="anchor"
        to="/about"
      >
        About
      </Link>,
      { context: createContextWithRouter(router) }
    );

    router.push('/about');
    expect(wrapper.hasClass('anchor-active')).to.be.false; // eslint-disable-line no-unused-expressions


    wrapper.setProps({ activeClassName: 'anchor-active' });
    expect(wrapper.hasClass('anchor-active')).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('subscribes to router service for matching route and changes activeClass accordingly ' +
    'when "to" prop is changed', () => {
    const router = new MemoryRouterService();

    const wrapper = mount(
      <Link
        activeClassName="anchor-active"
        className="anchor"
        to="/about"
      >
        About
      </Link>,
      { context: createContextWithRouter(router) }
    );

    router.push('/about');
    expect(wrapper.hasClass('anchor-active')).to.be.true; // eslint-disable-line no-unused-expressions

    wrapper.setProps({ to: '/contact' });
    expect(wrapper.hasClass('anchor-active')).to.be.false; // eslint-disable-line no-unused-expressions

    router.push('/contact');
    expect(wrapper.hasClass('anchor-active')).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('subscribes to router service for matching route and changes activeClass accordingly ' +
    'when exact prop is changed', () => {
    const router = new MemoryRouterService();

    const wrapper = mount(
      <Link
        activeClassName="anchor-active"
        className="anchor"
        to="/about"
      >
        About
      </Link>,
      { context: createContextWithRouter(router) }
    );

    router.push('/about/whatever');
    expect(wrapper.hasClass('anchor-active')).to.be.true; // eslint-disable-line no-unused-expressions

    wrapper.setProps({ exact: true });
    expect(wrapper.hasClass('anchor-active')).to.be.false; // eslint-disable-line no-unused-expressions

    router.push('/about');
    expect(wrapper.hasClass('anchor-active')).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('unsubscribes from router getMatch$ when unmounted and when resubscribes', () => {
    let subscribeCount = 0;
    let unsubscribeCount = 0;

    const subscription = {
      unsubscribe() {
        unsubscribeCount += 1;
      }
    };

    const router = {
      getMatch$() {
        return {
          subscribe() {
            subscribeCount += 1;
            return subscription;
          }
        };
      }
    };

    const wrapper = mount(
      <Link
        activeClassName="anchor-active"
        className="anchor"
        to="/about"
      >
        About
      </Link>,
      { context: createContextWithRouter(router) }
    );

    expect(subscribeCount).to.equal(1);
    expect(unsubscribeCount).to.equal(0);

    // forcing to resubscribe by providing new url
    wrapper.setProps({ to: '/company' });
    expect(subscribeCount).to.equal(2);
    expect(unsubscribeCount).to.equal(1);

    wrapper.unmount();
    expect(subscribeCount).to.equal(2);
    expect(unsubscribeCount).to.equal(2);
  });

  it('pushes new url to router, prevents default and doesn\'t stopPropagation when clicked', () => {
    const pushedUrls = [];

    const router = {
      push(url) {
        pushedUrls.push(url);
      }
    };

    const wrapper = shallow(
      <Link className="anchor" to="/about">About</Link>,
      { context: createContextWithRouter(router) }
    );

    let preventDefaultCalled = false;
    let stopPropagationCalled = false;
    wrapper.simulate('click', {
      preventDefault() { preventDefaultCalled = true; },
      stopPropagation() { stopPropagationCalled = true; }
    });

    expect(pushedUrls).to.deep.equal(['/about']);
    expect(preventDefaultCalled).to.be.true; // eslint-disable-line no-unused-expressions
    expect(stopPropagationCalled).to.be.false; // eslint-disable-line no-unused-expressions
  });
});
