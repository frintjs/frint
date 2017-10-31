/* eslint-disable import/no-extraneous-dependencies, func-names, no-unused-expressions */
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

  it('renders anchor with href, className and children when no type prop is passed', function () {
    const linkContent = <span className="decorated">About</span>;

    const wrapper = shallow(
      <Link className="anchor" to="/about">{linkContent}</Link>,
      { context: createContextWithRouter() }
    );

    expect(wrapper.name()).to.equal('a');
    expect(wrapper.hasClass('anchor')).to.be.true;

    expect(wrapper.children().length).to.equal(1);
    expect(wrapper.children().get(0)).to.eql(linkContent);
  });

  it('renders button with type, className and children when type prop is passed', function () {
    const linkContent = <span className="decorated">About</span>;

    const wrapper = shallow(
      <Link className="fancy-button" to="/about" type="button">{linkContent}</Link>,
      { context: { app: {} } }
    );

    expect(wrapper.name()).to.equal('button');
    expect(wrapper.prop('type')).to.equal('button');
    expect(wrapper.hasClass('fancy-button')).to.be.true;

    expect(wrapper.children().length).to.equal(1);
    expect(wrapper.children().get(0)).to.eql(linkContent);
  });

  it('subscribes to router service for  matching route inexactly and changes activeClass accordingly ' +
    'when activeClassName is passed', function () {
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
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor')).to.be.true;
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.false;

    router.push('/about');
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor')).to.be.true;
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.true;

    router.push('/about/whatever');
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor')).to.be.true;
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.true;

    router.push('/');
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor')).to.be.true;
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.false;
  });

  it('subscribes to router service for exactly matching route and changes activeClass accordingly ' +
    'when activeClassName and exact is passed', function () {
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
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.false;

    router.push('/about');
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.true;

    router.push('/about/whatever');
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.false;

    router.push('/');
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.false;
  });

  it('subscribes to router service for matching route and changes activeClass accordingly ' +
    'even when activeClassName is passed and changed later on', function () {
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
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.false;

    wrapper.setProps({ activeClassName: 'anchor-active' });
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.true;

    wrapper.setProps({ activeClassName: 'anchor-super-active' });
    expect(wrapper.find(Link).children().hasClass('anchor-super-active')).to.be.true;
  });

  it('subscribes to router service for matching route and changes activeClass accordingly ' +
    'when "to" prop is changed', function () {
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
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.true;

    wrapper.setProps({ to: '/contact' });
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.false;

    router.push('/contact');
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.true;
  });

  it('subscribes to router service for matching route and changes activeClass accordingly ' +
    'when exact prop is changed', function () {
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
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.true;


    wrapper.setProps({ exact: true });
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.false;

    router.push('/about');
    wrapper.update();
    expect(wrapper.find(Link).children().hasClass('anchor-active')).to.be.true;
  });

  it('unsubscribes from router getMatch$ when unmounted and when resubscribes', function () {
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

  describe('prevents default and doesn\'t stopPropagation when clicked ', function () {
    const pushedUrls = [];
    const actualRouter = new MemoryRouterService();

    const router = {
      push(url) {
        actualRouter.push(url);
        pushedUrls.push(url);
      },

      getHistory() {
        return actualRouter.getHistory();
      },

      getMatch(...args) {
        return actualRouter.getMatch.call(actualRouter, ...args);
      }
    };

    const wrapper = shallow(
      <Link className="anchor" to="/about">About</Link>,
      { context: createContextWithRouter(router) }
    );

    it('and pushes new url to router when it doesn\'t match current url', function () {
      let preventDefaultCalled = 0;
      let stopPropagationCalled = 0;
      wrapper.simulate('click', {
        preventDefault() { preventDefaultCalled += 1; },
        stopPropagation() { stopPropagationCalled += 1; }
      });

      expect(pushedUrls).to.deep.equal(['/about']);
      expect(preventDefaultCalled).to.equal(1);
      expect(stopPropagationCalled).to.equal(0);
    });


    it('and doesn\'t push new url to router when it matches current url', function () {
      let preventDefaultCalled = 0;
      let stopPropagationCalled = 0;
      wrapper.simulate('click', {
        preventDefault() { preventDefaultCalled += 1; },
        stopPropagation() { stopPropagationCalled += 1; }
      });

      // nothing new was added to the pushedUrls and that's the point
      expect(pushedUrls).to.deep.equal(['/about']);
      expect(preventDefaultCalled).to.equal(1);
      expect(stopPropagationCalled).to.equal(0);
    });
  });
});
