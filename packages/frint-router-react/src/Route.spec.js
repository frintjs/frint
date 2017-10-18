/* eslint-disable import/no-extraneous-dependencies, func-names, no-unused-expressions */
/* global describe, it, before, resetDOM */
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { createApp } from 'frint';
import { MemoryRouterService } from 'frint-router';

import Route from './Route';

function createContext() {
  const App = createApp({
    name: 'TestRouterApp',
    providers: [
      {
        name: 'router',
        useFactory: function () {
          return new MemoryRouterService();
        },
        cascade: true,
      },
    ],
  });

  return {
    app: new App()
  };
}

function getAppInstance(wrapper) {
  return wrapper.instance()._handler._appInstance;
}

describe('frint-route-react › Route', function () {
  before(function () {
    resetDOM();
  });

  it('renders nothing (null) when no app or component prop is passed', function () {
    // exact and path
    const wrapperPathExact = shallow(
      <Route exact path="/about" />,
      { context: createContext() }
    );

    expect(wrapperPathExact.type()).to.be.null;

    // only path
    const wrapperPath = shallow(
      <Route path="/about" />,
      { context: createContext() }
    );

    expect(wrapperPath.type()).to.be.null;

    // only computedMatch
    const wrapperComputedMatch = shallow(
      <Route computedMatch={{ url: '/about' }} />,
      { context: createContext() }
    );

    expect(wrapperComputedMatch.type()).to.be.null;
  });

  it('renders component when route is matched not exactly', function () {
    const Component = () => <div>Matched</div>;

    const context = createContext();
    const wrapper = shallow(
      <Route component={Component} path="/about" />,
      { context }
    );

    context.app.get('router').push('/');
    wrapper.update();
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about');
    wrapper.update();
    expect(wrapper.type()).to.equal(Component);

    context.app.get('router').push('/service');
    wrapper.update();
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about/contact');
    wrapper.update();
    expect(wrapper.type()).to.equal(Component);
  });

  it('renders stateless component, when route is matched not exactly', function () {
    const context = createContext();
    const wrapper = shallow(
      <Route
        path="/about"
        render={function ({ match }) {
          return (
            <div>
              <div className="url">{match.url}</div>
            </div>
          );
        }}
      />,
      { context }
    );

    context.app.get('router').push('/');
    wrapper.update();
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about');
    wrapper.update();
    expect(wrapper.find('.url').text()).to.equal('/about');

    context.app.get('router').push('/service');
    wrapper.update();
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about/contact');
    wrapper.update();
    expect(wrapper.find('.url').text()).to.equal('/about');
  });

  it('renders component when exact prop passed and route is matched exactly', function () {
    const Component = () => <div>Matched</div>;

    const context = createContext();
    const wrapper = shallow(
      <Route component={Component} exact path="/about" />,
      { context }
    );

    context.app.get('router').push('/');
    wrapper.update();
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about');
    wrapper.update();
    expect(wrapper.type()).to.equal(Component);

    context.app.get('router').push('/service');
    wrapper.update();
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about/contact');
    wrapper.update();
    expect(wrapper.type()).to.be.null;
  });

  it('passes match from router to the component when it matches path', function () {
    const Component = () => <div>Matched</div>;

    const context = createContext();
    const wrapper = shallow(
      <Route component={Component} path="/about" />,
      { context }
    );

    context.app.get('router').push('/');
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about');
    wrapper.update();
    expect(wrapper.type()).to.equal(Component);
    expect(wrapper.prop('match')).to.include({ url: '/about', isExact: true });

    context.app.get('router').push('/about/contact');
    wrapper.update();
    expect(wrapper.type()).to.equal(Component);
    expect(wrapper.prop('match')).to.include({ url: '/about', isExact: false });
  });

  it('renders component only when computedMatch is passed and passes computedMatch as prop.match to child', function () {
    const Component = () => <div>Matched</div>;

    const context = createContext();
    const wrapper = shallow(
      <Route component={Component} computedMatch={{ url: '/about' }} />,
      { context }
    );

    expect(wrapper.type()).to.equal(Component);
    expect(wrapper.prop('match')).to.deep.equal({ url: '/about' });

    wrapper.setProps({ computedMatch: undefined });
    expect(wrapper.type()).to.be.null;
  });

  it('gives priority to computedMatch over path matching router url', function () {
    const Component = () => <div>Matched</div>;

    const context = createContext();
    const wrapper = shallow(
      <Route component={Component} computedMatch={{ url: '/computed' }} path="/about" />,
      { context }
    );

    context.app.get('router').push('/about');

    expect(wrapper.prop('match')).to.include({ url: '/computed' });

    wrapper.setProps({ computedMatch: undefined });
    expect(wrapper.prop('match')).to.include({ url: '/about' });

    wrapper.setProps({ computedMatch: { url: '/whatever' } });
    expect(wrapper.prop('match')).to.include({ url: '/whatever' });
  });

  describe('registers app, renders its component and then destroys it', function () {
    let beforeDestroyCallCount = 0;

    const AboutApp = createApp({
      name: 'AboutApp',
      providers: [
        {
          name: 'component',
          useValue: () => <article>About</article>,
        },
      ],
      beforeDestroy: () => {
        beforeDestroyCallCount += 1;
      }
    });

    const context = createContext();
    const wrapper = shallow(
      <Route app={AboutApp} path="/about" />,
      { context }
    );

    it('registers app with parent app from context', function () {
      const aboutApp = getAppInstance(wrapper);
      expect(aboutApp.getParentApp()).to.equal(context.app);
    });

    it('doesn\'t get rendered when path doesn\'t match', function () {
      expect(wrapper.type()).to.be.null;
    });

    it('gets rendered when path matches', function () {
      context.app.get('router').push('/about');
      wrapper.update();
      expect(wrapper.html()).to.equal('<article>About</article>');
      expect(wrapper.prop('match')).to.include({ url: '/about' });
    });

    it('beforeDestroy is called on unmount', function () {
      expect(beforeDestroyCallCount).to.equal(0);
      wrapper.unmount();
      expect(beforeDestroyCallCount).to.equal(1);
    });
  });

  describe('renders components, apps, registers and destroys them during lifecycle when they are changes in props', function () {
    const HomeComponent = () => <header>Home</header>;

    let beforeDestroyAboutCallCount = 0;

    const AboutApp = createApp({
      name: 'AboutApp',
      providers: [
        {
          name: 'component',
          useValue: () => <article>About</article>,
        },
      ],
      beforeDestroy: () => {
        beforeDestroyAboutCallCount += 1;
      }
    });

    let beforeDestroyServicesCallCount = 0;

    const ServicesApp = createApp({
      name: 'ServicesApp',
      providers: [
        {
          name: 'component',
          useValue: () => <section>Services</section>,
        },
      ],
      beforeDestroy: () => {
        beforeDestroyServicesCallCount += 1;
      }
    });

    const context = createContext();
    const wrapper = shallow(
      <Route component={HomeComponent} path="/about" />,
      { context }
    );

    it('renders nothing then path doesn\'t match', function () {
      expect(wrapper.type()).to.be.null;
    });

    it('renders HomeComponent when path matches', function () {
      context.app.get('router').push('/about');
      wrapper.update();
      expect(wrapper.html()).to.equal('<header>Home</header>');
    });

    let aboutApp;

    it('instantiates AboutApp and registers it with parent app from context', function () {
      wrapper.setProps({ app: AboutApp, component: undefined });

      aboutApp = getAppInstance(wrapper);
      expect(aboutApp.getParentApp()).to.equal(context.app);

      expect(wrapper.html()).to.equal('<article>About</article>');
    });

    it('doesn\'t destroy the app and doesn\'t reinitialise it when it\'s the same app', function () {
      wrapper.setProps({ app: AboutApp });
      expect(beforeDestroyAboutCallCount).to.equal(0);
      expect(getAppInstance(wrapper)).to.equal(aboutApp);
    });

    it('calls beforeDestroy for AboutApp when app is changed', function () {
      wrapper.setProps({ app: ServicesApp });
      expect(beforeDestroyAboutCallCount).to.equal(1);
    });

    it('instantiates servicesApp and registers it with parent app from context', function () {
      const servicesApp = getAppInstance(wrapper);
      expect(servicesApp.getParentApp()).to.equal(context.app);
      expect(servicesApp).to.not.equal(aboutApp);
    });

    it('renders ServicesApp', function () {
      expect(wrapper.html()).to.equal('<section>Services</section>');
    });

    it('destroys ServicesApp when switching to component', function () {
      expect(beforeDestroyServicesCallCount).to.equal(0);

      wrapper.setProps({ app: undefined, component: HomeComponent });
      expect(beforeDestroyServicesCallCount).to.equal(1);
      expect(getAppInstance(wrapper)).to.be.null;
    });

    it('renders HomeComponent', function () {
      expect(wrapper.html()).to.equal('<header>Home</header>');
    });

    it('unmounts nicely', function () {
      wrapper.unmount();
    });
  });
});
