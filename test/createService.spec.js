/* global describe, it */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createService from '../src/createService';
chai.use(sinonChai);

describe('createService', () => {
  const mySpec = {
    initialize: sinon.stub(),
    customFunction1() { return 'value1'; },
    customFunction2() { return 'value2'; },
    returnsThis() { return this; }
  };

  const myOptions = {
    app: {}
  };

  const MyService = createService(mySpec);
  const myServiceInstance = new MyService(myOptions);

  it('throws error when an app instance is not provided', () => {
    expect(() => new MyService()).to.throw(Error, 'App instance not provided.');
  });

  it('creates instance from my service', () => {
    expect(myServiceInstance).to.be.instanceOf(MyService);
  });

  it('executes the initialize() at construction', () => {
    expect(mySpec.initialize).to.be.callCount(1);
  });

  it('must contain the functions passed in the spec', () => {
    expect(myServiceInstance).to.include.all.keys('initialize', 'customFunction1', 'customFunction2', 'returnsThis');

    expect(myServiceInstance.customFunction1()).to.be.equal('value1');
    expect(myServiceInstance.customFunction2()).to.be.equal('value2');
  });

  it('must bind methods to the service instance', () => {
    expect(myServiceInstance.returnsThis()).to.be.deep.equal(myServiceInstance);
  });
});
