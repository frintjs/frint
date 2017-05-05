/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import createSchema from './createSchema';
import Schema from './Schema';

describe('frint-model › createSchema', () => {
  const schemaDescription = {
    field1: { default: 'defaultOne' },
  };
  const schema = createSchema(schemaDescription);

  it('creates a new schema and initializes it with the given schema description', () => {
    expect(schema).to.be.instanceOf(Schema);
  });

  it('initializes it with the given schema description', () => {
    // No idea how to test for this without breaking encapsulation :)
  });
});
