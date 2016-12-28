/* global describe, it */
/* eslint-disable global-require */

import _ from 'lodash';
import { expect } from 'chai';

import frint from '../src';

describe('index', function () {
  const publicModules = {
    combineReducers: require('../src/combineReducers'),
    createApp: require('../src/createApp'),
    createComponent: require('../src/createComponent'),
    createFactory: require('../src/createFactory'),
    createModel: require('../src/createModel'),
    Model: require('../src/Model'),
    PropTypes: require('../src/PropTypes'),
    Region: require('../src/components/Region'),
    render: require('../src/render'),
    isObservable: require('../src/utils/isObservable'),
  };

  _.each(publicModules, (module, moduleName) => {
    it(`exports module ${moduleName}`, () => {
      expect(frint[moduleName]).to.be.eql(module);
    });
  });
});
