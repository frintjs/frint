/* global describe, it */
import { expect } from 'chai';

import {
  Model as BaseModel,
  createModel,
} from '../src';

describe('createModel', () => {
  const mySpec = {
    getAttribute1() { return this.attributes.attribute1; },
    getAttribute2() { return this.attributes.attribute2; }
  };

  const myAttributes = {
    attribute1: 'value1',
    attribute2: 'value2'
  };

  const MyModel = createModel(mySpec);
  const myModelInstance = new MyModel(myAttributes);

  it('creates instance from my model, and its prototype is a base model', () => {
    expect(myModelInstance).to.be.instanceOf(MyModel);
    expect(Object.getPrototypeOf(myModelInstance)).to.be.instanceOf(BaseModel);
  });

  it('must have the attributes initialized as in its creation', () => {
    expect(myModelInstance.attributes).to.be.deep.equal(myAttributes);
  });

  it('must contain the functions passed in the spec', () => {
    expect('getAttribute1' in myModelInstance).to.be.equal(true);
    expect('getAttribute2' in myModelInstance).to.be.equal(true);

    expect(myModelInstance.getAttribute1()).to.be.equal('value1');
    expect(myModelInstance.getAttribute2()).to.be.equal('value2');
  });

  it('must have a method .toJS() that exports the attributes in a object literal', () => {
    expect('toJS' in myModelInstance).to.be.equal(true);
    expect(myModelInstance.toJS()).to.be.deep.equal(myAttributes);
  });

  it('triggers initialize method with constructor options', () => {
    const TestModel = createModel({
      initialize(attributes) {
        this.storedFromInitialize = attributes;
      }
    });

    const testModel = new TestModel({
      foo: 'bar'
    });

    expect(testModel.storedFromInitialize).to.deep.equal({
      foo: 'bar'
    });
  });
});
