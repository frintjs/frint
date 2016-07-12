/* global describe, it */
import chai, { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createComponent from '../src/createComponent';

const sandbox = sinon.sandbox.create();

chai.use(sinonChai);


describe('createComponent', function () {
  beforeEach(function () {
    sandbox.spy(React, 'createClass');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('creates a component', function () {
    const mySpec = {
      myCustomFunction() { return 'foo'; },
      render() { return null; }
    };
    const MyComponent = createComponent(mySpec);
    const myComponentInstance = new MyComponent();

    expect(React.createClass)
      .to.be.callCount(1)
      .and.to.be.calledWith({
        myCustomFunction: mySpec.myCustomFunction,
        render: mySpec.render,
        componentDidMount: sinon.match.func,
        componentWillUnmount: sinon.match.func
      });
    expect(myComponentInstance).to.be.instanceof(MyComponent);
    expect('isReactComponent' in Object.getPrototypeOf(myComponentInstance)).to.be.equal(true);
    expect(myComponentInstance.myCustomFunction()).to.be.equal('foo');
    expect(myComponentInstance.render()).to.be.equal(null);
  });
});
