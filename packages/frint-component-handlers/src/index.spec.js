/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import lib from './index';

describe('frint-component-handlers › index', function () {
  it('exports an object', function () {
    expect(lib).to.be.an('object');
  });
});
