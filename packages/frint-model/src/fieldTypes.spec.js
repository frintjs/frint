/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import fieldTypes from './fieldTypes';

describe('frint-model › fieldTypes', () => {
  it('constructs fieldtypes only once', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(fieldTypes.string === fieldTypes.string).to.be.true;
  });

  it('constructs different fieldtypes for different types', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(fieldTypes.string === fieldTypes.complex).to.be.false;
  });

  it('has a string type', () => {
    const myType = fieldTypes.string;
    expect(myType.typeName).to.be.equal('string');
  });

  it('has an anonymous complex type', () => {
    const myType = fieldTypes.complex;
    expect(myType.typeName).to.be.equal('complex');
  });

  it('has a string type', () => {
    const myType = fieldTypes.of('peanuts');
    expect(myType.typeName).to.be.equal('of');
    expect(myType.schemaType).to.be.equal('peanuts');
  });
});
