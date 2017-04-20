/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import Model from './Model';

describe('frint-model › Model', () => {
  const myAttributes = {
    attribute1: 'value1',
    attribute2: 'value2',
    attribute3: {
      attribute31: 'value31'
    }
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

  it('must have the attributes available with .get() method', () => {
    expect(myModelInstance.get('attribute1')).to.be.deep.equal('value1');
    expect(myModelInstance.get('attribute2')).to.be.deep.equal('value2');
    expect(myModelInstance.get('attribute3')).to.be.deep.equal(myAttributes.attribute3);
  });

  it('must return nested attribut value for the key by get() method', () => {
    expect(myModelInstance.get('attribute3.attribute31')).to.be.deep.equal('value31');
  });

  it('must return an undefined using .get() method if attribute doesn\'t exist', () => {
    expect(myModelInstance.get('attributeNotExist')).to.be.deep.equal(undefined);
  });
});
