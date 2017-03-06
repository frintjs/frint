/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it, document, before, after, resetDOM */
import { expect } from 'chai';
import { Observable } from 'rxjs';
import React from 'react';
import ReactDOM from 'react-dom';

import observe from './observe';
import Provider from './Provider';
import render from '../render';

describe('frint-react › components › observe', function () {
  before(function () {
    resetDOM();
  });

  it('is a function', function () {
    expect(observe).to.be.a('function');
  });

  it('generates Component bound to observable for props, without app in context', function () {
    const Component = React.createClass({
      render() {
        return (
          <p id="counter">{this.props.counter}</p>
        );
      }
    });

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
    const Component = React.createClass({
      render() {
        return (
          <p id="text">Hello World</p>
        );
      }
    });

    const ObservedComponent = observe()(Component);

    ReactDOM.render(
      <ObservedComponent />,
      document.getElementById('root')
    );

    expect(document.getElementById('text').innerHTML).to.equal('Hello World');
  });

  it('generates Component bound to observable for props, with app in context', function () {
    const Component = React.createClass({
      render() {
        return (
          <p id="name">{this.props.name}</p>
        );
      }
    });

    const ObservedComponent = observe(function (app) {
      return Observable
        .of(app.getOption('name'))
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
      getOption(key) {
        const options = { name: 'FakeApp' };
        return options[key];
      }
    };

    render(
      fakeApp,
      document.getElementById('root')
    );

    expect(document.getElementById('name').innerHTML).to.equal('FakeApp');
  });
});
