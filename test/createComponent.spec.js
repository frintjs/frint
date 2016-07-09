/* global describe, it */
import chai, { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createComponent from '../src/createComponent';

chai.use(sinonChai);
sinon.spy(React, 'createClass');


describe('createComponent', function () {
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
