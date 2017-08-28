/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it, document, beforeEach, resetDOM */
import { expect } from 'chai';
import { Observable } from 'rxjs';
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
      return Observable
        .of(1)
        .map(number => ({ counter: number }));
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

  it('generates Component bound to observable for props, with app in context', function () {
    function Component({ name }) {
      return (
        <p id="name">{name}</p>
      );
    }

    const ObservedComponent = observe(function (app) {
      return Observable
        .of(app.getName())
        .map(name => ({ name }));
    })(Component);

    const fakeApp = {
      get(key) {
        if (key !== 'component') {
          return null;
        }

        return (...props) => (
          <Provider app={fakeApp}>
            <ObservedComponent {...props} />
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
      return Observable
        .of(app.getName())
        .map(name => ({ name }));
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
