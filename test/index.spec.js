/* global describe, it */
/* eslint-disable global-require */

import _ from 'lodash';
import { expect } from 'chai';

import frint from '../src';

describe('index', function () {
  const publicModules = {
    createApp: require('../src/core/createApp'),
  };

  _.each(publicModules, (module, moduleName) => {
    it(`exports module ${moduleName}`, () => {
      expect(frint[moduleName]).to.be.eql(module);
    });
  });
});
