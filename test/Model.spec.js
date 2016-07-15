/* global describe, it */
import { expect } from 'chai';
import Model from '../src/Model';

describe('Model', () => {
  const myAttributes = {
    attribute1: 'value1',
    attribute2: 'value2'
  };

  const myModelInstance = new Model(myAttributes);

  it('creates instance from Model', () => {
    expect(myModelInstance).to.be.instanceOf(Model);
  });

  it('must have the attributes initialized as in its creation', () => {
    expect(myModelInstance.attributes).to.be.deep.equal(myAttributes);
  });

  it('must have a method .toJS() that exports the attributes in a object literal', () => {
    expect('toJS' in myModelInstance).to.be.equal(true);
    expect(myModelInstance.toJS()).to.be.deep.equal(myAttributes);
  });
});
