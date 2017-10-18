/* eslint-disable import/no-extraneous-dependencies, func-names, no-unused-expressions */
/* global describe, it */
import { expect } from 'chai';
import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';
import { createApp } from 'frint';
import { MemoryRouterService } from 'frint-router';

import Route from './Route';
import Switch from './Switch';

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

describe('frint-router-react › Switch', function () {
  it('switches routes according to router and passes computedMatch', function () {
    const HomeComponent = () => <header>HomeComponent</header>;
    const AboutComponent = () => <article>AboutComponent</article>;
    const NotFound = () => <div>Not found</div>;

    const context = createContext();
    const router = context.app.get('router');

    const wrapper = shallow(
      <Switch>
        <Route component={HomeComponent} exact path="/"/>
        <Route component={AboutComponent} path="/about" />
        <Route component={NotFound} />
      </Switch>,
      { context }
    );


    it('renders Route when it\'s path matches exactly', function () {
      router.push('/');

      expect(wrapper.type()).to.equal(Route);

      expect(wrapper.props()).to.deep.equal({
        computedMatch: { url: '/', isExact: true, params: {} },
        component: HomeComponent,
        exact: true,
        path: '/'
      });
    });

    it('renders Route when it\'s path matches inexactly, skipping first one which requires exact match', function () {
      router.push('/about/our-sport-team');

      expect(wrapper.props()).to.deep.equal({
        computedMatch: { url: '/about', isExact: false, params: {} },
        component: AboutComponent,
        path: '/about'
      });
    });

    it('renders default Route when nothing matches and doesn\'t pass computedMatch to it', function () {
      router.push('/not-the-page-youre-looking-for');

      expect(wrapper.props()).to.deep.equal({
        component: NotFound,
        computedMatch: { url: '/not-the-page-youre-looking-for', isExact: false, params: {} }
      });
    });
  });

  it('renders only first match', function () {
    const FirstComponent = () => <h1>FirstComponent</h1>;
    const SecondComponent = () => <h2>SecondComponent</h2>;

    const context = createContext();
    const router = context.app.get('router');

    const wrapper = shallow(
      <Switch>
        <Route component={FirstComponent} path="/about" />
        <Route component={SecondComponent} path="/about" />
      </Switch>,
      { context }
    );

    router.push('/about');
    wrapper.update();
    expect(wrapper.type()).to.eql(Route);
    expect(wrapper.props()).to.eql({
      computedMatch: { url: '/about', isExact: true, params: {} },
      component: FirstComponent,
      path: '/about'
    });
  });

  it('renders only first match, also if it\'s default', function () {
    const DefaultComponent = () => <h1>DefaultComponent</h1>;
    const SecondComponent = () => <h2>SecondComponent</h2>;

    const context = createContext();
    const router = context.app.get('router');

    const wrapper = shallow(
      <Switch>
        <Route component={DefaultComponent} />
        <Route component={SecondComponent} path="/services" />
      </Switch>,
      { context }
    );

    router.push('/services');
    wrapper.update();
    expect(wrapper.type()).to.equal(Route);
    expect(wrapper.props()).to.deep.equal({
      component: DefaultComponent,
      computedMatch: { url: '/services', isExact: false, params: {} }
    });
  });

  it('renders nothing if there\'s no match', function () {
    const ServicesComponent = () => <h2>ServicesComponent</h2>;

    const context = createContext();
    const router = context.app.get('router');

    const wrapper = shallow(
      <Switch>
        <Route component={ServicesComponent} path="/services" />
      </Switch>,
      { context }
    );

    router.push('/about');

    expect(wrapper.type()).to.equal(null);
  });

  it('renders nothing if there\'s no match', function () {
    const ServicesComponent = () => <h2>ServicesComponent</h2>;

    const context = createContext();
    const router = context.app.get('router');

    const wrapper = shallow(
      <Switch>
        <Route component={ServicesComponent} path="/services" />
      </Switch>,
      { context }
    );

    router.push('/about');

    expect(wrapper.type()).to.equal(null);
  });

  it('unsubscribes from router on unmount', function () {
    let subscribeCount = 0;
    let unsubscribeCount = 0;

    const subscription = {
      unsubscribe() {
        unsubscribeCount += 1;
      }
    };

    const router = {
      getHistory$() {
        return {
          subscribe() {
            subscribeCount += 1;
            return subscription;
          }
        };
      }
    };

    const context = {
      app: {
        // eslint-disable-next-line consistent-return
        get(key) {
          if (key === 'router') {
            return router;
          }
        }
      }
    };

    const wrapper = shallow(
      <Switch />,
      { context }
    );

    expect(subscribeCount).to.equal(1);
    expect(unsubscribeCount).to.equal(0);

    wrapper.unmount();
    expect(subscribeCount).to.equal(1);
    expect(unsubscribeCount).to.equal(1);
  });

  describe('switches routes correctly when child Routes are changing', function () {
    let beforeDestroyCallCount = 0;

    const HomeApp = createApp({
      name: 'HomeApp',
      providers: [
        {
          name: 'component',
          useValue: () => <article>HomeApp</article>,
        },
      ],
      beforeDestroy: () => {
        beforeDestroyCallCount += 1;
      }
    });

    const WrapperComponent = ({ routeSet }) => {
      const changingRoutes = [];

      if (routeSet === 1) {
        changingRoutes.push(
          <Route component={() => <header>HomeComponent</header>} exact key="1h" path="/home" />,
          <Route component={() => <article>ServicesComponent</article>} key="1s" path="/services" />,
        );
      } else if (routeSet === 2) {
        changingRoutes.push(
          <Route app={HomeApp} exact key="2h" path="/home" />
        );
      }

      return (
        <Switch>
          {changingRoutes}
          <Route component={() => <div>Not found</div>} key="0n" />
        </Switch>
      );
    };

    WrapperComponent.propTypes = {
      routeSet: PropTypes.number
    };

    const context = createContext();
    const router = context.app.get('router');

    const wrapper = mount(
      <WrapperComponent routeSet={1} />,
      { context, childContextTypes: { app: PropTypes.object } }
    );

    it('renders matching Route and component from the first set', function () {
      router.push('/services');
      expect(wrapper.html()).to.equal('<article>ServicesComponent</article>');
    });

    it('falls back to default when matching Route disappears', function () {
      wrapper.setProps({ routeSet: 2 });
      expect(wrapper.html()).to.equal('<div>Not found</div>');
    });

    it('renders matching HomeApp when URL matches', function () {
      router.push("/home");
      expect(wrapper.html()).to.equal('<article>HomeApp</article>');
      expect(beforeDestroyCallCount).to.equal(0);
    });

    it('renders another component matching the same route, destorying previous app', function () {
      wrapper.setProps({ routeSet: 1 });
      expect(beforeDestroyCallCount).to.equal(1);
      expect(wrapper.html()).to.equal('<header>HomeComponent</header>');
    });
  });

  it('doesn\'t crash when not React elements are passed as children', function () {
    const DefaultComponent = () => <h2>DefaultComponent</h2>;

    const context = createContext();

    const wrapper = shallow(
      <Switch>
        {0}
        {'string'}
        <Route component={DefaultComponent} />
      </Switch>,
      { context }
    );

    expect(wrapper.type()).to.equal(Route);
    expect(wrapper.props()).to.deep.equal({
      component: DefaultComponent,
      computedMatch: { url: '/', isExact: false, params: {} }
    });
  });
});
