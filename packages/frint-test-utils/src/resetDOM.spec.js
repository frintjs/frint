/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
/* eslint-disable global-require */
import { expect } from 'chai';

import { resetDOM } from './';

describe('frint-test-utils › resetDOM', function () {
  it('is a function', function () {
    expect(resetDOM).to.be.a('function');
  });
});
