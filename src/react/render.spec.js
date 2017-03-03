/* eslint-disable import/no-extraneous-dependencies, func-names */
/* globals after, before, describe, document, it */
import chai, { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import render from './render';

chai.use(sinonChai);

const FakeComponent = React.createClass({
  render() { return null; }
});
const sandbox = sinon.sandbox.create();

describe('react › render', function () {
  const appStub = {
    afterMount: sandbox.stub(),
    beforeMount: sandbox.stub(),
    beforeUnmount: sandbox.stub(),
    getComponent: sandbox.stub().returns(FakeComponent)
  };

  let renderedComponent;
  let targetElement;

  before(() => {
    this.jsdom = require('jsdom-global')('<html><body><div id="root"></div></body></html>'); // eslint-disable-line global-require
    sandbox.spy(React, 'createClass');
    sandbox.spy(ReactDOM, 'render');
    targetElement = document.getElementById('root');
    renderedComponent = render(appStub, targetElement);
  });

  after(() => {
    sandbox.restore();
    this.jsdom();
  });

  it('calls app\'s getComponent method', () => {
    expect(appStub.getComponent).to.be.callCount(1);
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
