/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import DefaultValues from './DefaultValues';
import createModel from './createModel';

describe('frint-model › DefaultValues', () => {
  const schema = {
    field1: { default: 'defaultOne' },
    field2: { default: 'defaultTwo' },
  };
  const sut = new DefaultValues();
  sut.initialize(schema);

  it('initializes from a schema to store the default values', () => {
    expect(sut.defaults.field1).to.be.equal('defaultOne');
    expect(sut.defaults.field2).to.be.equal('defaultTwo');
  });

  it('sets the model values when applied', () => {
    const ModelDef = createModel();
    const modelInstance = new ModelDef({});
    sut.applyToModelInstance(modelInstance);

    expect(modelInstance.get('field1')).to.be.equal('defaultOne');
    expect(modelInstance.get('field2')).to.be.equal('defaultTwo');
  });

  it('skips the model fields that have been defined already', () => {
    const ModelDef = createModel();
    const modelInstance = new ModelDef({ field1: "customOne" });
    sut.applyToModelInstance(modelInstance);

    expect(modelInstance.get('field1')).to.be.equal('customOne');
    expect(modelInstance.get('field2')).to.be.equal('defaultTwo');
  });
});
