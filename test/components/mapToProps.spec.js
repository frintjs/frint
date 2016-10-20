/* global afterEach, beforeEach, describe, it, window, document */
import { expect } from 'chai';
import React from 'react';

import {
  createApp,
  createComponent,
  combineReducers,
  render,
  createService,
  createFactory,
  mapToProps
} from '../../src';

describe('components › mapToProps', () => {
  afterEach(() => {
    delete window.app;
    document.getElementById('root').innerHTML = '';
  });

  it('is a function', function () {
    expect(mapToProps).to.be.a('function');
  });

  it('returns a function, returning a Component', function () {
    const TestComponent = createComponent({
      displayName: 'TestComponent',

      render() {
        return null;
      }
    });

    const Container = mapToProps()(TestComponent);
    expect(Container).to.be.a('function');
    expect(Container.displayName).to.equal('mapToProps(TestComponent)');
    expect(Container.contextTypes).to.exist; // eslint-disable-line
  });

  describe('Injection', function () {
    const TestComponent = createComponent({
      render() {
        return (
          <div>
            <p className="appId">{this.props.appId}</p>
            <p className="text">Hello World</p>
            <p className="serviceName">{this.props.foo.getName()}</p>
            <p className="factoryName">{this.props.bar.getName()}</p>
          </div>
        );
      }
    });

    const TestRootComponent = mapToProps({
      app(app) {
        return {
          appId: app.getOption('appId')
        };
      },
      services: {
        foo: 'foo'
      },
      factories: {
        bar: 'bar'
      }
    })(TestComponent);

    const TestFooService = createService({
      getName() {
        return 'TestService';
      }
    });

    const TestBarFactory = createFactory({
      getName() {
        return 'TestFactory';
      }
    });

    const TestApp = createApp({
      appId: 'test',
      component: TestRootComponent,
      services: {
        foo: TestFooService
      },
      factories: {
        bar: TestBarFactory
      }
    });

    it('creates container from component', function () {
      expect(TestRootComponent).to.be.a('function');
      expect(TestRootComponent.displayName).to.be.a('string');

      const app = new TestApp();
      render(app, document.getElementById('root'));

      const text = document.querySelector('#root .text');
      expect(text.innerHTML).to.equal('Hello World');
    });

    it('maps from App instance to props', function () {
      const app = new TestApp({
        appId: 'customAppIdHere'
      });
      render(app, document.getElementById('root'));

      const text = document.querySelector('#root .appId');
      expect(text.innerHTML).to.equal('customAppIdHere');
    });

    it('maps from Service to props', function () {
      const app = new TestApp();
      render(app, document.getElementById('root'));

      const text = document.querySelector('#root .serviceName');
      expect(text.innerHTML).to.equal('TestService');
    });

    it('maps from Factory to props', function () {
      const app = new TestApp();
      render(app, document.getElementById('root'));

      const text = document.querySelector('#root .factoryName');
      expect(text.innerHTML).to.equal('TestFactory');
    });
  });

  describe('Dispatchable actions and state', function () {
    const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
    const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

    const INITIAL_STATE = {
      value: 10
    };

    function counterReducer(state = INITIAL_STATE, action) {
      switch (action.type) {
        case INCREMENT_COUNTER:
          return Object.assign({}, {
            value: state.value + 1
          });

        case DECREMENT_COUNTER:
          return Object.assign({}, {
            value: state.value - 1
          });

        default:
          return state;
      }
    }

    const testRootReducer = combineReducers({
      counter: counterReducer
    });

    function incrementCounter() {
      return { type: INCREMENT_COUNTER };
    }

    function decrementCounter() {
      return { type: DECREMENT_COUNTER };
    }

    const TestComponent = createComponent({
      render() {
        return (
          <div>
            <a className="add" onClick={() => this.props.incrementCounter()}>Add</a>
            <a className="subtract" onClick={() => this.props.decrementCounter()}>Subtract</a>
            <p className="counter">{this.props.counter}</p>
          </div>
        );
      }
    });

    const TestRootComponent = mapToProps({
      dispatch: {
        incrementCounter,
        decrementCounter
      },
      state(state) {
        return {
          counter: state.counter.value
        };
      }
    })(TestComponent);

    const TestApp = createApp({
      appId: 'Test',
      reducer: testRootReducer,
      component: TestRootComponent,
      enableLogger: false
    });

    it('renders with initial state', function () {
      const app = new TestApp();
      render(app, document.getElementById('root'));

      expect(document.querySelector('#root .counter').innerHTML).to.equal('10');
    });

    it('re-renders with updated state upon dispatched actions', function () {
      const app = new TestApp();
      render(app, document.getElementById('root'));

      document.querySelector('#root .add').click(); // 11
      document.querySelector('#root .add').click(); // 12
      document.querySelector('#root .subtract').click(); // 11

      expect(document.querySelector('#root .counter').innerHTML).to.equal('11');
    });
  });
});
