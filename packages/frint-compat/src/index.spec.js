/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import lib from './index';

describe('frint-compat › index', function () {
  it('exports empty object', function () {
    expect(lib).to.deep.equal({});
  });
});
