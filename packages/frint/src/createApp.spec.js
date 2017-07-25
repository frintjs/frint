/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import App from './App';
import createApp from './createApp';

describe('frint › createApp', function () {
  it('is a function', function () {
    expect(createApp).to.be.a('function');
  });

  it('returns App class', function () {
    const MyApp = createApp({
      name: 'MyAppNameFromClass',
    });

    const app = new MyApp({
      name: 'MyAppNameFromInstance',
    });

    expect(app).to.be.instanceOf(App);
    expect(app.getName()).to.equal('MyAppNameFromInstance');
  });
});
