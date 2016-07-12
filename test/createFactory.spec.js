/* global describe, it */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createFactory from '../src/createFactory';
chai.use(sinonChai);

describe('createFactory', function () {
  it('returns a Factory class', function () {
    const fakeAppInstance = {};
    const mySpec = {
      initialize: sinon.stub(),
      myCustomFunction: () => 'value'
    };

    const MyFactory = createFactory(mySpec);
    const myFactoryInstance = new MyFactory({ app: fakeAppInstance });

    /** Executes the initialize() at construction */
    expect(mySpec.initialize).to.be.callCount(1);

    /** Must be an instance of MyFactory and contain the app instance passed */
    expect(myFactoryInstance).to.be.instanceOf(MyFactory);
    expect(myFactoryInstance.app).to.be.deep.equal(fakeAppInstance);

    /* And contain the functions passed in the spec */
    expect('myCustomFunction' in myFactoryInstance).to.be.equal(true);
    expect(myFactoryInstance.myCustomFunction()).to.be.equal('value');
  });
});
