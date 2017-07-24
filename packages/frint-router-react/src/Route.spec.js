/* eslint-disable import/no-extraneous-dependencies, func-names, no-unused-expressions */
/* global describe, it */
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

describe('frint-route-react › Route', function () {
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
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about');
    expect(wrapper.type()).to.equal(Component);

    context.app.get('router').push('/service');
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about/contact');
    expect(wrapper.type()).to.equal(Component);
  });

  it('renders component when exact prop passed and route is matched exactly', function () {
    const Component = () => <div>Matched</div>;

    const context = createContext();
    const wrapper = shallow(
      <Route component={Component} exact path="/about" />,
      { context }
    );

    context.app.get('router').push('/');
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about');
    expect(wrapper.type()).to.equal(Component);

    context.app.get('router').push('/service');
    expect(wrapper.type()).to.be.null;

    context.app.get('router').push('/about/contact');
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
    expect(wrapper.type()).to.equal(Component);
    expect(wrapper.prop('match')).to.include({ url: '/about', isExact: true });

    context.app.get('router').push('/about/contact');
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

  it('registers app, renders its component and then destroys it', function () {
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

    // registers app with parent app from context
    const aboutApp = wrapper.instance().routeApp;
    expect(aboutApp.getParentApp()).to.equal(context.app);

    // doesn't get rendered
    expect(wrapper.type()).to.be.null;

    // gets rendered
    context.app.get('router').push('/about');
    expect(wrapper.html()).to.equal('<article>About</article>');
    expect(wrapper.prop('match')).to.include({ url: '/about' });

    // beforeDestroy is called on unmount
    expect(beforeDestroyCallCount).to.equal(0);
    wrapper.unmount();
    expect(beforeDestroyCallCount).to.equal(1);
  });

  it('renders components, apps, registers and destroys them during lifecycle when they are changes in props', function () {
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

    // nothing rendered
    expect(wrapper.type()).to.be.null;

    // HomeComponent rendered
    context.app.get('router').push('/about');
    expect(wrapper.html()).to.equal('<header>Home</header>');

    // instantiates AboutApp and registers it with parent app from context
    wrapper.setProps({ app: AboutApp, component: undefined });

    const aboutApp = wrapper.instance().routeApp;
    expect(aboutApp.getParentApp()).to.equal(context.app);

    expect(wrapper.html()).to.equal('<article>About</article>');

    // an app doesn't get destroyed and reinitialised when it's the same app
    wrapper.setProps({ app: AboutApp });
    expect(beforeDestroyAboutCallCount).to.equal(0);
    expect(wrapper.instance().routeApp).to.equal(aboutApp);

    // beforeDestroy is called for AboutApp when app is changed
    wrapper.setProps({ app: ServicesApp });
    expect(beforeDestroyAboutCallCount).to.equal(1);

    // instantiates servicesApp and registers it with parent app from context
    const servicesApp = wrapper.instance().routeApp;
    expect(servicesApp.getParentApp()).to.equal(context.app);
    expect(servicesApp).to.not.equal(aboutApp);

    // renders ServicesApp
    expect(wrapper.html()).to.equal('<section>Services</section>');

    // destroys ServicesApp when switching to component
    expect(beforeDestroyServicesCallCount).to.equal(0);

    wrapper.setProps({ app: undefined, component: HomeComponent });
    expect(beforeDestroyServicesCallCount).to.equal(1);
    expect(wrapper.instance().routeApp).to.be.null;

    // renders HomeComponent
    expect(wrapper.html()).to.equal('<header>Home</header>');

    // unmounts nicely
    wrapper.unmount();
  });
});
