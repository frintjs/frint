/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import FieldType from './FieldType';

describe('frint-model › FieldType', () => {
  const myType = new FieldType('type1', { customProp1: 'customVal' });

  it('sets the typeName when created', () => {
    expect(myType.typeName).to.be.equal('type1');
  });

  it('sets sets custom properties', () => {
    expect(myType.customProp1).to.be.equal('customVal');
  });
});
