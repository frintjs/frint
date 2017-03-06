/* eslint-disable import/no-extraneous-dependencies, func-names */
/* globals after, before, describe, document, it */
import chai, { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { render } from './';

chai.use(sinonChai);

const FakeComponent = React.createClass({
  render() { return null; }
});
const sandbox = sinon.sandbox.create();

describe('react › render', function () {
  const appStub = {
    get: sandbox.stub().returns(FakeComponent),
    afterMount: sandbox.stub(),
    beforeMount: sandbox.stub(),
    beforeUnmount: sandbox.stub(),
  };

  let renderedComponent;
  let targetElement;

  before(() => {
    sandbox.spy(React, 'createClass');
    sandbox.spy(ReactDOM, 'render');
    targetElement = document.getElementById('root');
    renderedComponent = render(appStub, targetElement);
  });

  after(() => {
    sandbox.restore();
  });

  it('calls app\'s get method', () => {
    expect(appStub.get).to.be.callCount(1);
  });

  it('calls app\'s beforeMount lifecyle method', () => {
    expect(appStub.beforeMount).to.be.callCount(1);
  });

  it('calls React.createClass to create a WrapperComponent with lifecyle methods', () => {
    expect(React.createClass)
      .to.be.callCount(1)
      .and.to.be.calledWith({
        componentDidMount: sinon.match.func,
        componentWillUnmount: sinon.match.func,
        displayName: 'WrapperComponent',
        render: sinon.match.func
      });
  });

  it('calls app\'s afterMount lifecyle method (on componentDidMount)', () => {
    expect(appStub.afterMount).to.be.callCount(1);
  });

  it('calls app\'s beforeUnmount lifecyle method when component unmounts', () => {
    renderedComponent.componentWillUnmount();
    expect(appStub.beforeUnmount).to.be.callCount(1);
  });
});
