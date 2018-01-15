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
      const { rule } = Rules.isNotEmpty({
        field: 'foo',
        message: 'Cannot be empty',
      });

      expect(rule(fakeModel)).to.equal(true);

      fakeModel.foo = '';
      expect(rule(fakeModel)).to.equal(false);
    });

    it('with non-string values', function () {
      const fakeModel = {
        foo: null,
      };
      const { rule } = Rules.isNotEmpty({
        field: 'foo',
        message: 'Cannot be empty',
      });

      expect(rule(fakeModel)).to.equal(false);

      fakeModel.foo = undefined;
      expect(rule(fakeModel)).to.equal(false);

      fakeModel.foo = false;
      expect(rule(fakeModel)).to.equal(false);

      fakeModel.foo = false;
      expect(rule(fakeModel)).to.equal(false);
    });
  });

  describe('maxLength', function () {
    it('with string', function () {
      const fakeModel = {
        foo: '333',
      };
      const { rule } = Rules.maxLength({
        field: 'foo',
        length: 3,
        message: 'Cannot be more than 3 characters',
      });

      expect(rule(fakeModel)).to.equal(true);

      fakeModel.foo = '4444';
      expect(rule(fakeModel)).to.equal(false);
    });
  });

  describe('minLength', function () {
    it('with string', function () {
      const fakeModel = {
        foo: '333',
      };
      const { rule } = Rules.minLength({
        field: 'foo',
        length: 3,
        message: 'Cannot be more than 3 characters',
      });

      expect(rule(fakeModel)).to.equal(true);

      fakeModel.foo = '22';
      expect(rule(fakeModel)).to.equal(false);
    });
  });
});
