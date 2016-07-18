/* global describe, it */
import chai, { expect } from 'chai';
import React, { Children, Component, PropTypes } from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Provider from '../../src/components/Provider';

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);

describe('components › Provider', function () {
  const fakeApp = {};
  const fakeStore = {};
  const fakeChildren = (<div id="myFakeChildren"></div>);
  let myProviderInstance;

  beforeEach(function () {
    sandbox.spy(Children, 'only');
    myProviderInstance = new Provider({
      app: fakeApp,
      children: fakeChildren,
      store: fakeStore
    })
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('extends React.Component', function () {
    expect(Object.getPrototypeOf(Provider)).to.be.equal(Component);
  });

  it('has static propTypes defined', function () {
    expect(Provider.propTypes).to.be.deep.equal({
      app: PropTypes.object.isRequired,
      children: PropTypes.element.isRequired,
      store: PropTypes.object.isRequired
    });
  });

  it('has static childContextTypes defined', function () {
    expect(Provider.childContextTypes).to.be.deep.equal({
      app: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired
    });
  });

  it('has the app and store as private properties, just like the passed arguments', function () {
    expect(myProviderInstance.app).to.be.deep.equal(fakeApp);
    expect(myProviderInstance.store).to.be.deep.equal(fakeStore);
  });

  it('has a getChildContext method which returns app and store objects of the instance', function () {
    expect(myProviderInstance.getChildContext()).to.be.deep.equal({
      app: fakeApp,
      store: fakeStore
    });
  });

  it('calls React.Children.only() with the props.children provided, on render', function () {
    myProviderInstance.render();
    expect(Children.only)
      .to.be.callCount(1)
      .and.to.be.calledWith(fakeChildren);
  });
});
