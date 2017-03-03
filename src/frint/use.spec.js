/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
/* eslint-disable global-require */
import { expect } from 'chai';

import Frint from '../';

describe('frint', function () {
  it('can install plugins', function () {
    const MyPlugin = {
      install(f, options) {
        f.myPluginInstalled = options.value;
      }
    };

    Frint.use(MyPlugin, { value: 'ok' });
    expect(Frint.myPluginInstalled).to.equal('ok');
  });

  it('throws error if `install` function is not available in plugin', function () {
    const MyPlugin = {};

    expect(() => {
      Frint.use(MyPlugin);
    }).to.throw(/Plugin does not have any `install` option/);
  });
});
