/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import index from './index';

describe('frint-react › index', function () {
  it('exports an object with the required keys', function () {
    expect(index).to.be.an('object');
    expect(index).to.have.all.keys(
      'render',
      'hydrate',
      'streamProps',
      'isObservable',
      'getMountableComponent',
      'observe',
      'Region',
      'Provider',
      'RegionService',
      'ReactHandler',
    );
  });
});
