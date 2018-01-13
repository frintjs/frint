/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import lib from './index';

describe('frint-data-validation › index', function () {
  it('is an object', function () {
    expect(lib).to.be.an('object');
  });
});
