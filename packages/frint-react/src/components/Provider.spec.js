/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global afterEach, beforeEach, describe, it */
import chai, { expect } from 'chai';
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Provider from './Provider';

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);

describe('frint-react › components › Provider', function () {
  const fakeApp = {};
  const fakeChildren = (<div id="myFakeChildren"/>);
  let myProviderInstance;

  beforeEach(function () {
    sandbox.spy(Children, 'only');
    myProviderInstance = new Provider({
      app: fakeApp,
      children: fakeChildren
    });
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
      children: PropTypes.element.isRequired
    });
  });

  it('has static childContextTypes defined', function () {
    expect(Provider.childContextTypes).to.be.deep.equal({
      app: PropTypes.object.isRequired
    });
  });

  it('has the app as private property, just like the passed arguments', function () {
    expect(myProviderInstance.app).to.be.deep.equal(fakeApp);
  });

  it('has a getChildContext method which returns app object of the instance', function () {
    expect(myProviderInstance.getChildContext()).to.be.deep.equal({
      app: fakeApp
    });
  });

  it('calls React.Children.only() with the props.children provided, on render', function () {
    myProviderInstance.render();
    expect(Children.only)
      .to.be.callCount(1)
      .and.to.be.calledWith(fakeChildren);
  });
});
