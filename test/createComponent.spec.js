/* global afterEach, beforeEach, describe, it, document */
import chai, { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {
  createComponent,
  h,
} from '../src';

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);

describe('createComponent', () => {
  const expectedRender = <div className="test"/>;
  const mySpec = {
    myCustomFunction() { return 'foo'; },
    render() { return expectedRender; }
  };
  let MyComponent;
  let myComponentInstance;

  beforeEach(() => {
    sandbox.spy(React, 'createClass');
    MyComponent = createComponent(mySpec);
    myComponentInstance = ReactDOM.render(<MyComponent />, document.getElementById('root'));
  });

  afterEach(() => {
    const element = document.querySelector('#root .test');
    element.parentNode.removeChild(element);
    sandbox.restore();
  });

  it('calls React.createClass once, at component creation', () => {
    expect(React.createClass)
      .to.be.callCount(1)
      .and.to.be.calledWith({
        myCustomFunction: mySpec.myCustomFunction,
        render: mySpec.render,
        componentDidMount: sinon.match.func,
        componentWillUnmount: sinon.match.func,
        getDOMElement: sinon.match.func
      });
  });

  it('is a valid React component and a MyComponent\'s instance', () => {
    expect('isReactComponent' in Object.getPrototypeOf(myComponentInstance)).to.be.equal(true);
    expect(myComponentInstance).to.be.instanceof(MyComponent);
  });

  it('gets the DOM Node when executing getDOMElement()', () => {
    expect(myComponentInstance.getDOMElement()).to.be.equal(document.querySelector('#root .test'));
  });

  it('has the spec\'s functions', () => {
    expect(myComponentInstance.myCustomFunction()).to.be.equal('foo');
    expect(myComponentInstance.render()).to.be.equal(expectedRender);
  });

  it('throws an error if no render method is defined', function () {
    const noRenderSpec = {
      name: 'mySillyApp'
    };

    expect(createComponent.bind(null, noRenderSpec))
      .to.throw('Component mySillyApp missing required method: render');
  });
});
