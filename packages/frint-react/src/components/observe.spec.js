/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it, document, beforeEach, resetDOM */
import { expect } from 'chai';
import { merge as merge$ } from 'rxjs/observable/merge';
import { of as of$ } from 'rxjs/observable/of';
import { map as map$ } from 'rxjs/operator/map';
import { scan as scan$ } from 'rxjs/operator/scan';
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

  it('generates Component bound to observable for props, without app in context', function () {
    function Component({ counter }) {
      return (
        <p id="counter">{counter}</p>
      );
    }

    const ObservedComponent = observe(function () {
      return of$(1)
        ::map$(number => ({ counter: number }));
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
      return merge$(
        of$({ name: app.getName() }),
        props$::map$(parentProps => ({ parentProps }))
      )
        ::scan$((props, emitted) => {
          return {
            ...props,
            ...emitted,
          };
        });
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
        ::map$(name => ({ name }));
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
});
