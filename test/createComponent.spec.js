/* global describe, it */
import chai, { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createComponent from '../src/createComponent';

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);

describe('createComponent', function () {
  const mySpec = {
    myCustomFunction() { return 'foo'; },
    render() { return null; }
  };

  let MyComponent;
  let myComponentInstance;

  beforeEach(function () {
    sandbox.spy(React, 'createClass');
    MyComponent = createComponent(mySpec);
    myComponentInstance = new MyComponent();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('calls React.createClass once, at component creation', function () {
    expect(React.createClass)
      .to.be.callCount(1)
      .and.to.be.calledWith({
        myCustomFunction: mySpec.myCustomFunction,
        render: mySpec.render,
        componentDidMount: sinon.match.func,
        componentWillUnmount: sinon.match.func
      });
  });

  it('is a valid React component and a MyComponent\'s instance', function () {
    expect('isReactComponent' in Object.getPrototypeOf(myComponentInstance)).to.be.equal(true);
    expect(myComponentInstance).to.be.instanceof(MyComponent);
  });

  it('has the spec\'s functions', function () {
    expect(myComponentInstance.myCustomFunction()).to.be.equal('foo');
    expect(myComponentInstance.render()).to.be.equal(null);
  });

  it('throws an error if no render method is defined', function () {
    const noRenderSpec = {};

    expect(createComponent.bind(null, noRenderSpec))
      .to.throw('Render is a required method.');
  });

  it('throws an error if render is not a function', function () {
    const badRenderSpec = {
      render: 'it is a string moron'
    }

    expect(createComponent.bind(null, badRenderSpec))
      .to.throw('Render is a required method.');
  });
});
