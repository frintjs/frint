import chai, { expect } from 'chai';
import render from '../src/render';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);


const FakeComponent = React.createClass({
  render() { return null; }
});
const targetElement = document.getElementById('root');
const sandbox = sinon.sandbox.create();

describe('render', () => {
  const appStub = {
    afterMount: sandbox.stub(),
    beforeMount: sandbox.stub(),
    beforeUnmount: sandbox.stub(),
    render: sandbox.stub().returns(FakeComponent)
  };

  let renderedComponent;

  before(() => {
    sandbox.spy(React, 'createClass');
    sandbox.spy(ReactDOM, 'render');
    renderedComponent = render(appStub, targetElement);
  });

  after(() => {
    sandbox.restore();
    targetElement.innerHTML = '';
  });

  it('calls app\'s render method', () => {
    expect(appStub.render).to.be.callCount(1);
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
