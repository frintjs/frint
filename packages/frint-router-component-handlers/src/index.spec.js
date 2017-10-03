/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import index from './index';

describe('frint-router-component-handlers › index', function () {
  it('exports an object with createLinkHandler, createRouteHandler, createSwitchHandler keys', function () {
    expect(index).to.be.an('object');
    expect(index).to.have.all.keys('createLinkHandler', 'createRouteHandler', 'createSwitchHandler');
  });
});
