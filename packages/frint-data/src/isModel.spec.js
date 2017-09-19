/* global describe, it */
import { expect } from 'chai';

import Types from '../src/Types';
import createModel from '../src/createModel';
import isModel from '../src/isModel';

describe('isModel', function () {
  it('returns true when object is a valid Model instance', function () {
    const Person = createModel({
      name: Types.string
    });

    const model = new Person({ name: 'Fahad' });
    expect(isModel(model)).to.eql(true);
  });

  it('returns false when object is NOT a model', function () {
    expect(isModel(123)).to.eql(false);
    expect(isModel('hi')).to.eql(false);
    expect(isModel(() => {})).to.eql(false);
  });
});
