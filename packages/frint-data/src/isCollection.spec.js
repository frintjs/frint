/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import Types from './Types';
import createModel from './createModel';
import createCollection from './createCollection';
import isCollection from './isCollection';

describe('frint-data › isCollection', function () {
  it('returns true when object is a valid Collection instance', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });
    const People = createCollection({
      model: Person,
    });

    const people = new People([]);

    expect(isCollection(people)).to.equal(true);
  });

  it('returns false when object is NOT a collection', function () {
    expect(isCollection(123)).to.equal(false);
    expect(isCollection('hi')).to.equal(false);
    expect(isCollection({})).to.equal(false);
    expect(isCollection([])).to.equal(false);
    expect(isCollection(() => {})).to.equal(false);
    expect(isCollection(null)).to.equal(false);
    expect(isCollection(undefined)).to.equal(false);
    expect(isCollection(true)).to.equal(false);
    expect(isCollection(false)).to.equal(false);
  });
});
