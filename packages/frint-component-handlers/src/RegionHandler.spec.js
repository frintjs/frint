/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import { createApp } from 'frint';
import { composeHandlers } from 'frint-component-utils';

import RegionHandler from './RegionHandler';
import RegionService from './RegionService';

describe('frint-component-handlers › RegionHandler', function () {
  const RootApp = createApp({
    name: 'MyRootApp',
    providers: [
      {
        name: 'component',
        useValue: 'MyRootAppComponent',
      },
    ],
  });

  const ChildApp1 = createApp({
    name: 'MyChildApp1',
    providers: [
      {
        name: 'component',
        useValue: 'MyChildApp1Component',
      },
      {
        name: 'region',
        useClass: RegionService,
      },
    ],
  });

  const ChildApp2 = createApp({
    name: 'MyChildApp2',
    providers: [
      {
        name: 'component',
        useValue: 'MyChildApp2Component',
      },
    ],
  });

  it('is an object', function () {
    expect(RegionHandler).to.be.an('object');
  });

  it('updates list with components', function () {
    const app = new RootApp();
    app.registerApp(ChildApp1, {
      regions: ['sidebar'],
      weight: 5,
    });
    app.registerApp(ChildApp2, {
      regions: ['sidebar'],
      weight: 10,
    });

    const handler = composeHandlers(
      {
        _data: {},
        _props: {},
        setData(key, value) {
          this._data[key] = value;
        },
        getData(key) {
          return this._data[key];
        },
        getProp(key) {
          return this.getProps()[key];
        },
        getProps() {
          return this._props;
        },
      },
      RegionHandler,
      {
        app,
      },
    );

    handler._data = handler.getInitialData();
    handler._props = {
      name: 'sidebar',
    };

    handler.beforeMount();
    handler.afterMount();
    handler.afterUpdate();
    handler.afterUpdate({
      name: 'sidebar',
    });
    handler.beforeDestroy();

    expect(handler.getData('listForRendering').length).to.equal(2);
  });

  it('updates list with multi-instance app components', function () {
    const app = new RootApp();
    app.registerApp(ChildApp1, {
      regions: ['sidebar'],
      multi: true,
    });

    const handler = composeHandlers(
      {
        _data: {},
        _props: {},
        setData(key, value) {
          this._data[key] = value;
        },
        getData(key) {
          return this._data[key];
        },
        getProp(key) {
          return this.getProps()[key];
        },
        getProps() {
          return this._props;
        },
      },
      RegionHandler,
      {
        app,
      },
    );

    handler._data = handler.getInitialData();
    handler._props = {
      name: 'sidebar',
      uniqueKey: 'sidebar-1',
    };

    handler.beforeMount();
    handler.afterMount();
    handler.afterUpdate();
    handler.afterUpdate({
      name: 'sidebar',
      uniqueKey: 'sidebar-1',
    });
    handler.beforeDestroy();

    expect(handler.getData('listForRendering').length).to.equal(1);
  });
});
