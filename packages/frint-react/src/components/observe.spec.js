/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it, document, beforeEach, resetDOM */
import { expect } from 'chai';
import { merge as merge$ } from 'rxjs/observable/merge';
import { of as of$ } from 'rxjs/observable/of';
import { map as map$ } from 'rxjs/operators/map';
import { scan as scan$ } from 'rxjs/operators/scan';
import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';

import observe from './observe';
import Provider from './Provider';
import render from '../render';

describe('frint-react › components › observe', function () {
  beforeEach(function () {
    resetDOM();
  });

  it('is a function', function () {
    expect(observe).to.be.a('function');
  });

  it('generates Component with display name if WrappedComponent has display name', function () {
    function Component() {}
    Component.displayName = 'NamedComponent';

    const ObservedComponent = observe()(Component);

    expect(ObservedComponent.displayName).to.equal('observe(NamedComponent)');
  });

  it('generates Component with display name if WrappedComponent has no display name', function () {
    function UnnamedComponent() {}

    const ObservedComponent = observe()(UnnamedComponent);

    expect(ObservedComponent.displayName).to.equal('observe(UnnamedComponent)');
  });

  it('generates Component bound to observable for props, without app in context', function () {
    function Component({ counter }) {
      return (
        <p id="counter">{counter}</p>
      );
    }

    const ObservedComponent = observe(function () {
      return of$(1)
        .pipe(map$(number => ({ counter: number })));
    })(Component);

    ReactDOM.render(
      <ObservedComponent />,
      document.getElementById('root')
    );

    expect(document.getElementById('counter').innerHTML).to.equal('1');
  });

  it('generates Component with no additional impact, if no function is given', function () {
    function Component() {
      return (
        <p id="text">Hello World</p>
      );
    }

    const ObservedComponent = observe()(Component);

    ReactDOM.render(
      <ObservedComponent />,
      document.getElementById('root')
    );

    expect(document.getElementById('text').innerHTML).to.equal('Hello World');
  });

  it('generates Component bound to observable for props, with app in context and props from parent component', function () {
    function Component({ name, counter, parentProps }) {
      return (
        <div>
          <p id="name">{name}</p>
          <p id="counter">{counter}</p>
          <p id="counterFromParent">{parentProps.counter}</p>
        </div>
      );
    }

    const ObservedComponent = observe(function (app, props$) {
      const generatedProps$ = merge$(
        of$({ name: app.getName() }),
        props$.pipe(map$(parentProps => ({ parentProps })))
      )
        .pipe(scan$((props, emitted) => {
          return {
            ...props,
            ...emitted,
          };
        }));

      generatedProps$.defaultProps = {
        name: app.getName(),
      };

      return generatedProps$;
    })(Component);

    class ParentComponent extends React.Component {
      constructor(...args) {
        super(...args);

        this.state = {
          counter: 0,
        };
      }

      incrementCounter = () => {
        this.setState({
          counter: this.state.counter + 1,
        });
      };

      render() {
        return (
          <div>
            <button
              id="increment"
              onClick={() => this.incrementCounter()}
              type="button"
            >
              Increment
            </button>

            <ObservedComponent counter={this.state.counter} />
          </div>
        );
      }
    }

    const fakeApp = {
      get() {
        return (...props) => (
          <Provider app={fakeApp}>
            <ParentComponent {...props} />
          </Provider>
        );
      },
      beforeMount() {},
      afterMount() {},
      beforeUnmount() {},
      getName() {
        return 'FakeApp';
      }
    };

    render(
      fakeApp,
      document.getElementById('root')
    );

    expect(document.getElementById('name').innerHTML).to.equal('FakeApp');
    expect(document.getElementById('counter').innerHTML).to.equal('0');
    expect(document.getElementById('counterFromParent').innerHTML).to.equal('0');

    document.getElementById('increment').click();
    expect(document.getElementById('counter').innerHTML).to.equal('1');
    expect(document.getElementById('counterFromParent').innerHTML).to.equal('1');
  });

  it('can be tested with enzyme', function () {
    function ChildComponent() {
      return <p>I am a child.</p>;
    }

    function Component({ name }) {
      return (
        <div>
          <p id="name">{name}</p>

          <ChildComponent />
        </div>
      );
    }

    const ObservedComponent = observe(function (app) {
      return of$(app.getName())
        .pipe(map$(name => ({ name })));
    })(Component);

    const fakeApp = {
      getName() {
        return 'ShallowApp';
      }
    };

    function ComponentToRender(props) {
      return (
        <Provider app={fakeApp}>
          <ObservedComponent {...props} />
        </Provider>
      );
    }

    const wrapper = mount(<ComponentToRender />);
    expect(wrapper.find(ObservedComponent)).to.have.length(1);
    expect(wrapper.find(ObservedComponent)).to.have.length(1);
    expect(wrapper.find(ChildComponent)).to.have.length(1);
    expect(wrapper.find('#name')).to.have.length(1);
    expect(wrapper.text()).to.contain('I am a child');
  });

  it('can return props synchronously', function () {
    function Component({ name }) {
      return (
        <div>
          <p id="name">{name}</p>
        </div>
      );
    }

    const ObservedComponent = observe(function (app) {
      return {
        name: app.getName(),
      };
    })(Component);

    const fakeApp = {
      getName() {
        return 'FakeApp';
      }
    };

    function ComponentToRender(props) {
      return (
        <Provider app={fakeApp}>
          <ObservedComponent {...props} />
        </Provider>
      );
    }

    const wrapper = mount(<ComponentToRender />);
    expect(wrapper.find(ObservedComponent)).to.have.length(1);
    expect(wrapper.find(Component)).to.have.length(1);
    expect(wrapper.find('#name')).to.have.length(1);
    expect(wrapper.text()).to.contain('FakeApp');
  });
});
