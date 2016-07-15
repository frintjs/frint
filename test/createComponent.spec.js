/* global describe, it */
import chai, { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createComponent from '../src/createComponent';

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);

describe('createComponent', () => {
  const mySpec = {
    myCustomFunction() { return 'foo'; },
    render() { return null; }
  };
  let MyComponent;
  let myComponentInstance;

  beforeEach(() => {
    sandbox.spy(React, 'createClass');
    MyComponent = createComponent(mySpec);
    myComponentInstance = new MyComponent();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls React.createClass once, at component creation', () => {
    expect(React.createClass)
      .to.be.callCount(1)
      .and.to.be.calledWith({
        myCustomFunction: mySpec.myCustomFunction,
        render: mySpec.render,
        componentDidMount: sinon.match.func,
        componentWillUnmount: sinon.match.func
      });
  });

  it('is a valid React component and a MyComponent\'s instance', () => {
    expect('isReactComponent' in Object.getPrototypeOf(myComponentInstance)).to.be.equal(true);
    expect(myComponentInstance).to.be.instanceof(MyComponent);
  });

  it('has the spec\'s functions', () => {
    expect(myComponentInstance.myCustomFunction()).to.be.equal('foo');
    expect(myComponentInstance.render()).to.be.equal(null);
  });
});
