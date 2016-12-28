/* global afterEach, beforeEach, describe, it, window, document, resetDOM */
import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import { Subject } from 'rxjs';
import sinon from 'sinon';

import {
  createApp,
  createComponent,
  combineReducers,
  render,
  Region,
  mapToProps,
  h
} from '../../src';

describe('components › Region', () => {
  function generateCoreAppTemplate(appOptions = {}, regionName) {
    const MyCoreComponent = createComponent({
      render() { return <Region name={regionName} />; }
    });

    const MyCoreApp = createApp({
      name: 'myAppName',
      component: MyCoreComponent,
      enableLogger: false,
    });

    return new MyCoreApp(appOptions);
  }

  function generateWidgetAppTemplate(appName, widgetName, regionToSetTo) {
    const MyWidgetComponent = createComponent({
      render() { return (<div className="myWidgetComponent">{appName} - {widgetName}</div>); }
    });

    const MyWidgetApp = createApp({
      appName: appName,
      name: widgetName,
      component: MyWidgetComponent,
      enableLogger: false,
    });

    const myWidgetAppInstance = new MyWidgetApp();

    myWidgetAppInstance.setRegion(regionToSetTo);

    return myWidgetAppInstance;
  }

  afterEach(() => {
    delete window.app;
    document.getElementById('root').innerHTML = '';
  });

  it('fails to mount when the "name" prop is missing (unable to set observable)', () => {
    window.app = generateCoreAppTemplate();
    expect(() => render(window.app, document.getElementById('root'))).to.throw(TypeError);
  });

  it('renders properly the region and renders a widget on it', () => {
    window.app = generateCoreAppTemplate(undefined, 'myRegionName');
    render(window.app, document.getElementById('root'));

    generateWidgetAppTemplate('app1', 'myWidgetName', 'myRegionName');
    expect(document.querySelectorAll('#root .myWidgetComponent').length).to.be.eql(1);
    expect(document.querySelector('#root .myWidgetComponent').textContent).to.be.eql('app1 - myWidgetName');
  });

  it('renders properly the region and renders two widgets on it', () => {
    window.app = generateCoreAppTemplate(undefined, 'myRegionName');
    render(window.app, document.getElementById('root'));

    generateWidgetAppTemplate('app1', 'myWidgetName1', 'myRegionName');
    generateWidgetAppTemplate('app2', 'myWidgetName2', 'myRegionName');

    expect(document.querySelectorAll('#root .myWidgetComponent').length).to.be.eql(2);
    expect(document.querySelectorAll('#root .myWidgetComponent')[0].textContent).to.be.eql('app1 - myWidgetName1');
    expect(document.querySelectorAll('#root .myWidgetComponent')[1].textContent).to.be.eql('app2 - myWidgetName2');
  });

  it('renders properly the region and renders two widgets on it, with the same name and different appNames', () => {
    window.app = generateCoreAppTemplate(undefined, 'myRegionName');
    render(window.app, document.getElementById('root'));

    generateWidgetAppTemplate('app1', 'myWidgetName', 'myRegionName');
    generateWidgetAppTemplate('app2', 'myWidgetName', 'myRegionName');

    expect(document.querySelectorAll('#root .myWidgetComponent').length).to.be.eql(2);
    expect(document.querySelectorAll('#root .myWidgetComponent')[0].textContent).to.be.eql('app1 - myWidgetName');
    expect(document.querySelectorAll('#root .myWidgetComponent')[1].textContent).to.be.eql('app2 - myWidgetName');
  });

  describe('Multiple widgets', function () {
    // Core App
    const CORE_SET_SIDEBAR_VISIBILITY = 'CORE_SET_SIDEBAR_VISIBILITY';

    function coreSetSidebarVisibility(visible) {
      return {
        type: CORE_SET_SIDEBAR_VISIBILITY,
        visible
      };
    }

    const CORE_INITIAL_STATE = {
      sidebar: true
    };

    function coreVisibilityReducer(state = CORE_INITIAL_STATE, action) {
      switch (action.type) {
        case CORE_SET_SIDEBAR_VISIBILITY:
          return Object.assign({}, {
            sidebar: action.visible
          });

        default:
          return state;
      }
    }

    const coreRootReducer = combineReducers({
      visibility: coreVisibilityReducer
    });

    const CoreComponent = createComponent({
      render() {
        return (
          <div>
            <Region name="main" />
            {this.props.sidebarVisible && <Region name="sidebar" />}
          </div>
        );
      }
    });

    const CoreRootComponent = mapToProps({
      state(state) {
        return {
          sidebarVisible: state.visibility.sidebar,
        };
      }
    })(CoreComponent);

    const CoreApp = createApp({
      name: 'TestCore',
      component: CoreRootComponent,
      reducer: coreRootReducer,
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
      beforeUnmount() {
        return true;
      },

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

    it('unmounts widget if Region is removed', function () {
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

      window.app.dispatch(coreSetSidebarVisibility(false));

      expect(document.querySelector('#root .bar .text')).to.equal(null);
      expect(document.querySelector('#root .bar .counter')).to.equal(null);
    });

    it('should not render Region without any available Core App', function () {
      resetDOM();

      const SampleComponent = React.createClass({
        render() {
          return (
            <div className="sample">
              <p className="text">Hello</p>

              <Region name="main" />
            </div>
          );
        }
      });

      ReactDOM.render(<SampleComponent />, document.getElementById('root'));

      expect(document.querySelector('#root .sample .text').innerHTML).to.equal('Hello');
      expect(document.querySelector('#root .sample').innerHTML).to.contain('Hello</p><noscript');
    });

    it('should catch errors when observing for widgets', function () {
      window.app = new CoreApp();

      const subject$ = new Subject();
      window.app.observeWidgets$ = function () {
        return subject$;
      };

      render(window.app, document.getElementById('root'));

      const stub = sinon.stub(console, 'warn');
      subject$.error(new Error('Something bad happened...'));

      sinon.assert.calledTwice(stub); // two Regions
    });
  });
});
