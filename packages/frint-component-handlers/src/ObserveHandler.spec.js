/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { of as of$ } from 'rxjs/observable/of';

import { composeHandlers } from 'frint-component-utils';
import ObserveHandler from './ObserveHandler';

describe('frint-component-handlers › ObserveHandler', function () {
  it('is an object', function () {
    expect(ObserveHandler).to.be.an('object');
  });

  it('streams props from getProps$', function () {
    const app = {
      getName() {
        return 'MyAppName';
      },
    };

    const handler = composeHandlers(
      {
        _data: {},
        setData(key, value) {
          this._data[key] = value;
        },
        getData(key) {
          return this._data[key];
        },
      },
      ObserveHandler,
      {
        getProps$: function (a) {
          return of$({
            appName: a.getName(),
          });
        },
        app,
      },
    );

    expect(handler.getInitialData()).to.deep.equal({
      computedProps: {},
    });

    handler.beforeMount();
    handler.afterMount();
    handler.beforeDestroy();

    expect(handler.getData('computedProps')).to.deep.equal({
      appName: 'MyAppName',
    });
  });

  it('handles gracefully when no getProps$ is available', function () {
    const handler = composeHandlers(
      {
        _data: {},
        getData(key) {
          return this._data[key];
        },
      },
      ObserveHandler,
      {
        app: {},
      }
    );

    handler._data = handler.getInitialData();
    handler.beforeMount();
    handler.afterMount();
    handler.beforeDestroy();

    expect(handler.getData('computedProps')).to.deep.equal({});
  });
});
