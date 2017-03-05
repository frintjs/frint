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
    get: sandbox.stub().returns(FakeComponent)
  };

  let targetElement;

  before(() => {
    sandbox.spy(React, 'createClass');
    sandbox.spy(ReactDOM, 'render');
    targetElement = document.getElementById('root');
    render(appStub, targetElement);
  });

  after(() => {
    sandbox.restore();
  });

  it('calls app\'s get method', () => {
    expect(appStub.get).to.be.callCount(1);
  });
});
