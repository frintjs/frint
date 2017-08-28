/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import RegionService from './RegionService';

describe('frint-react › services › Region', function () {
  it('is a function', function () {
    expect(RegionService).to.be.a('function');
  });

  it('emits props', function (done) {
    const region = new RegionService();
    region.emit({
      key: 'value',
    });

    region.getProps$()
      .subscribe(function (props) {
        expect(props).to.deep.equal({
          key: 'value',
        });

        done();
      });
  });

  it('can get only data as an observable', function (done) {
    const region = new RegionService();
    region.emit({
      name: 'sidebar',
      data: {
        some: 'info',
      },
    });

    region.getData$()
      .subscribe(function (props) {
        expect(props).to.deep.equal({
          some: 'info',
        });

        done();
      });
  });
});
