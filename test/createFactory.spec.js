/* global describe, it */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createFactory from '../src/createFactory';
chai.use(sinonChai);

describe('createFactory', function () {
  const fakeAppInstance = {};
  const mySpec = {
    initialize: sinon.stub(),
    myCustomFunction: () => 'value'
  };

  const MyFactory = createFactory(mySpec);
  const myFactoryInstance = new MyFactory({ app: fakeAppInstance });

  it('executes the initialize() at construction', function () {
    expect(mySpec.initialize).to.be.callCount(1);
  });

  it('must be an instance of MyFactory and have the app passed', function () {
    expect(myFactoryInstance).to.be.instanceOf(MyFactory);
    expect(myFactoryInstance.app).to.be.deep.equal(fakeAppInstance);
  });

  it('must contain the functions passed in the spec', function () {
    expect('myCustomFunction' in myFactoryInstance).to.be.equal(true);
    expect(myFactoryInstance.myCustomFunction()).to.be.equal('value');
  });
});
