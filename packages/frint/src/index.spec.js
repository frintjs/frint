/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import Frint from '.';

describe('frint', function () {
  it('is an object', function () {
    expect(Frint).to.be.an('object');
  });

  it('has a version', function () {
    expect(Frint.version).to.be.a('string');
    expect(Frint.version.split('.')).to.have.lengthOf(3);
  });
});
