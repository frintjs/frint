/* global afterEach, beforeEach, describe, it, window, document, before, resetDOM */
import { expect } from 'chai';
import React from 'react';

import {
  createApp,
  createComponent,
  combineReducers,
  render,
  createService,
  createFactory,
  createModel,
  Region,
  mapToProps
} from '../../src';

describe('components › mapToProps', () => {
  before(function () {
    resetDOM();
  });

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
      beforeMount() {},
      afterMount() {},

      render() {
        return (
          <div>
            <p className="appId">{this.props.appId}</p>
            <p className="text">Hello World</p>
            <p className="serviceName">{this.props.foo.getName()}</p>
            <p className="factoryName">{this.props.bar.getName()}</p>
            <p className="modelName">{this.props.baz.getName()}</p>
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
      },
      models: {
        baz: 'baz'
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

    const TestBazModel = createModel({
      getName() {
        return this.attributes.name;
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
      },
      models: {
        baz: TestBazModel
      },
      modelAttributes: {
        baz: {
          name: 'TestBazModel'
        }
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

    it('maps from Model to props', function () {
      const app = new TestApp();
      render(app, document.getElementById('root'));

      const text = document.querySelector('#root .modelName');
      expect(text.innerHTML).to.equal('TestBazModel');
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

  describe('Shared state', function () {
    // Core App
    const CoreComponent = createComponent({
      render() {
        return (
          <div>
            <Region name="main" />
            <Region name="sidebar" />
          </div>
        );
      }
    });

    const CoreApp = createApp({
      appId: 'TestCore',
      component: CoreComponent
    });

    // Widget #1: Foo
    const FOO_INCREMENT_COUNTER = 'FOO_INCREMENT_COUNTER';

    function fooIncrementCounter() {
      return { type: FOO_INCREMENT_COUNTER };
    }

    const FOO_INITIAL_STATE = {
      value: 10
    };

    function fooCounterReducer(state = FOO_INITIAL_STATE, action) {
      switch (action.type) {
        case FOO_INCREMENT_COUNTER:
          return Object.assign({}, {
            value: state.value + 1
          });

        default:
          return state;
      }
    }

    const fooRootReducer = combineReducers({
      counter: fooCounterReducer
    });

    const FooComponent = createComponent({
      render() {
        return (
          <div className="foo">
            <p className="text">Hello World from Foo</p>
            <p className="counter">{this.props.counter}</p>
            <a className="add" onClick={() => this.props.incrementCounter()}>Add</a>
          </div>
        );
      }
    });

    const FooRootComponent = mapToProps({
      dispatch: {
        incrementCounter: fooIncrementCounter
      },
      state(state) {
        return {
          counter: state.counter.value
        };
      }
    })(FooComponent);

    const FooApp = createApp({
      appId: 'TestFooId',
      name: 'testFoo',
      component: FooRootComponent,
      reducer: fooRootReducer,
      enableLogger: false
    });

    // Widget #2: Bar
    const BarComponent = createComponent({
      render() {
        return (
          <div className="bar">
            <p className="text">Hello World from Bar</p>
            <p className="counter">{this.props.counter}</p>
          </div>
        );
      }
    });

    const BarRootComponent = mapToProps({
      shared(sharedState) {
        return {
          counter: (
            typeof sharedState.testFoo !== 'undefined' &&
            typeof sharedState.testFoo.counter !== 'undefined'
          )
            ? sharedState.testFoo.counter.value
            : 'n/a',
          sharedWasCalled: true
        };
      }
    })(BarComponent);

    const BarApp = createApp({
      appId: 'TestBarId',
      name: 'testBar',
      component: BarRootComponent
    });

    it('renders Widget Bar, with Foo\'s initial state', function () {
      window.app = new CoreApp();
      render(window.app, document.getElementById('root'));

      const fooApp = new FooApp();
      fooApp.setRegion('main');

      const barApp = new BarApp();
      barApp.readStateFrom(['testFoo']);
      barApp.setRegion('sidebar');

      expect(document.querySelector('#root .foo .text').innerHTML).to.equal('Hello World from Foo');
      expect(document.querySelector('#root .foo .counter').innerHTML).to.equal('10');

      expect(document.querySelector('#root .bar .text').innerHTML).to.equal('Hello World from Bar');
      expect(document.querySelector('#root .bar .counter').innerHTML).to.equal('10');
    });

    it('re-renders Widget Bar, with Foo\'s updated state', function () {
      window.app = new CoreApp();
      render(window.app, document.getElementById('root'));

      const fooApp = new FooApp();
      fooApp.setRegion('main');

      const barApp = new BarApp();
      barApp.readStateFrom(['testFoo']);
      barApp.setRegion('sidebar');

      expect(document.querySelector('#root .foo .text').innerHTML).to.equal('Hello World from Foo');
      expect(document.querySelector('#root .foo .counter').innerHTML).to.equal('10');

      document.querySelector('#root .foo .add').click();
      document.querySelector('#root .foo .add').click();
      expect(document.querySelector('#root .foo .counter').innerHTML).to.equal('12');

      expect(document.querySelector('#root .bar .text').innerHTML).to.equal('Hello World from Bar');
      expect(document.querySelector('#root .bar .counter').innerHTML).to.equal('12');
    });
  });
});
