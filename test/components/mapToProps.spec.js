/* global afterEach, beforeEach, describe, it, window, document, before, resetDOM */
import { expect } from 'chai';
import { Observable } from 'rxjs';

import {
  createApp,
  createComponent,
  combineReducers,
  render,
  createService,
  createFactory,
  createModel,
  Region,
  mapToProps,
  h,
} from '../../src';

describe('components › mapToProps', function () {
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
            <p className="name">{this.props.name}</p>
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
          name: app.getOption('name')
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
      name: 'test',
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
      },
      enableLogger: false,
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
        name: 'customNameHere'
      });
      render(app, document.getElementById('root'));

      const text = document.querySelector('#root .name');
      expect(text.innerHTML).to.equal('customNameHere');
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
    const INCREMENT_COUNTER_BY_STEP = 'INCREMENT_COUNTER_BY_STEP';
    const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
    const SET_COUNTER = 'SET_COUNTER';

    const INITIAL_STATE = {
      value: 10
    };

    function counterReducer(state = INITIAL_STATE, action) {
      switch (action.type) {
        case INCREMENT_COUNTER:
          return Object.assign({}, {
            value: state.value + 1
          });

        case INCREMENT_COUNTER_BY_STEP:
          return Object.assign({}, {
            value: state.value + action.step
          });

        case DECREMENT_COUNTER:
          return Object.assign({}, {
            value: state.value - 1
          });

        case SET_COUNTER:
          return Object.assign({}, {
            value: action.value
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

    function incrementCounterByStep(step) {
      return { type: INCREMENT_COUNTER_BY_STEP, step };
    }

    function setCounter(value) {
      return { type: SET_COUNTER, value };
    }

    function setCounterByStepAsync(step) {
      return (dispatch, getState, { app }) => {
        const currentState = getState();

        if (app.getOption('name') === 'Test') {
          const newValue = currentState.counter.value + step;

          dispatch(setCounter(newValue));
        }
      };
    }

    function decrementCounter() {
      return { type: DECREMENT_COUNTER };
    }

    const TestComponent = createComponent({
      render() {
        return (
          <div>
            <a className="add" onClick={() => this.props.incrementCounter()}>Add</a>
            <a className="addByStep" onClick={() => this.props.incrementCounterByStep(5)}>Add +5</a>
            <a className="subtract" onClick={() => this.props.decrementCounter()}>Subtract</a>
            <a className="setByStepAsync" onClick={() => this.props.setCounterByStepAsync(5)}>Set async</a>
            <p className="counter">{this.props.counter}</p>
          </div>
        );
      }
    });

    const TestRootComponent = mapToProps({
      dispatch: {
        incrementCounter,
        incrementCounterByStep,
        setCounterByStepAsync,
        decrementCounter
      },
      state(state) {
        return {
          counter: state.counter.value
        };
      }
    })(TestComponent);

    const TestApp = createApp({
      name: 'Test',
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
      document.querySelector('#root .add').click(); // 13
      document.querySelector('#root .add').click(); // 14

      document.querySelector('#root .subtract').click(); // 13
      document.querySelector('#root .subtract').click(); // 12

      expect(document.querySelector('#root .counter').innerHTML).to.equal('12');
    });

    it('triggers an action with arguments', () => {
      const app = new TestApp();
      render(app, document.getElementById('root'));

      document.querySelector('#root .addByStep').click(); // 15
      document.querySelector('#root .addByStep').click(); // 20
      expect(document.querySelector('#root .counter').innerHTML).to.equal('20');
    });

    it('triggers an asynchronous action', () => {
      const app = new TestApp();
      render(app, document.getElementById('root'));

      document.querySelector('#root .setByStepAsync').click(); // 15
      document.querySelector('#root .setByStepAsync').click(); // 20

      expect(document.querySelector('#root .counter').innerHTML).to.equal('20');
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
      name: 'TestCore',
      component: CoreComponent,
      enableLogger: false,
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
      name: 'testBar',
      component: BarRootComponent,
      enableLogger: false,
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

    it('re-renders Widget Bar, once Foo is loaded', function (done) {
      window.app = new CoreApp();
      render(window.app, document.getElementById('root'));

      const barApp = new BarApp();
      barApp.readStateFrom(['testFoo']);
      barApp.setRegion('sidebar');

      expect(document.querySelector('#root .bar .text').innerHTML).to.equal('Hello World from Bar');
      expect(document.querySelector('#root .bar .counter').innerHTML).to.equal('n/a');

      Promise.resolve(true) // eslint-disable-line
        .then(function () {
          // load Widget, after X ms
          return new Promise(function (resolve) {
            setTimeout(function () {
              const fooApp = new FooApp();
              fooApp.setRegion('main');

              resolve(true);
            }, 150);
          });
        })
        .then(function () {
          // assert, after X ms
          return new Promise(function (resolve) {
            setTimeout(function () {
              expect(document.querySelector('#root .foo .counter').innerHTML).to.equal('10');

              document.querySelector('#root .foo .add').click();
              document.querySelector('#root .foo .add').click();
              expect(document.querySelector('#root .foo .counter').innerHTML).to.equal('12');

              expect(document.querySelector('#root .bar .text').innerHTML).to.equal('Hello World from Bar');
              expect(document.querySelector('#root .bar .counter').innerHTML).to.equal('12');

              resolve(true);
            }, 150);
          });
        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  describe('Observable subscription', function () {
    const TestComponent = createComponent({
      render() {
        return (
          <div>
            <div className="name">{this.props.name}</div>
            <div className="total">{this.props.total}</div>
          </div>
        );
      }
    });

    const TestRootComponent = mapToProps({
      observe(app) {
        return Observable
          .of(1, 2)
          .scan((acc, number) => {
            acc.total += number;

            return acc;
          }, {
            name: app.getOption('name'),
            total: 0
          });
      }
    })(TestComponent);

    const TestApp = createApp({
      name: 'TestCore',
      component: TestRootComponent,
      enableLogger: false,
    });

    it('maps Observable values to props', function () {
      window.app = new TestApp();
      render(window.app, document.getElementById('root'));

      expect(document.querySelector('#root .total').innerHTML).to.equal('3');
    });

    it('can map values from app through `observe`', function () {
      window.app = new TestApp({
        name: 'customNameHere'
      });
      render(window.app, document.getElementById('root'));

      expect(document.querySelector('#root .name').innerHTML).to.equal('customNameHere');
    });
  });
});
