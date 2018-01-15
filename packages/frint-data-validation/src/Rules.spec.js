/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import Rules from './Rules';

describe('frint-data-validation › Rules', function () {
  it('is an object', function () {
    expect(Rules).to.be.an('object');
  });

  describe('isNotEmpty', function () {
    it('with string', function () {
      const fakeModel = {
        foo: 'foo value here',
      };
      const check = Rules.isNotEmpty('foo', 'Cannot be empty').rule;

      expect(check(fakeModel)).to.equal(true);

      fakeModel.foo = '';
      expect(check(fakeModel)).to.equal(false);
    });

    it('with non-string values', function () {
      const fakeModel = {
        foo: null,
      };
      const check = Rules.isNotEmpty('foo', 'Cannot be empty').rule;

      expect(check(fakeModel)).to.equal(false);

      fakeModel.foo = undefined;
      expect(check(fakeModel)).to.equal(false);

      fakeModel.foo = false;
      expect(check(fakeModel)).to.equal(false);

      fakeModel.foo = false;
      expect(check(fakeModel)).to.equal(false);
    });
  });
});
