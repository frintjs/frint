/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import Schema from './Schema';
import createModel from './createModel';

describe('frint-model › Schema', () => {
  it('can not be applied to a model if it hasn\'t been initialized', () => {
    const schema = new Schema();
    expect(schema.applyToModelInstance.bind(schema, {})).to.throw('Unable to apply schema to model, schema has not been initialized');
  });

  it('can be applied to an undefined model', () => {
    const schema = new Schema();
    schema.initialize();
    schema.applyToModelInstance(undefined);
    // eslint-disable-next-line no-unused-expressions
    expect('everything').to.be.ok;
  });

  it('can be applied to a model', () => {
    const schema = new Schema();
    schema.initialize({
      field1: { default: 'defaultOne' },
    });

    const ModelDefinition = createModel();
    const modelInstance = new ModelDefinition();
    schema.applyToModelInstance(modelInstance);
    expect(modelInstance.get('field1')).to.be.equal('defaultOne');
  });
});
