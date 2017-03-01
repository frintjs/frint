/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import App from '../App';
import createCore from '../createCore';

describe('core › createCore', function () {
  it('is a function', function () {
    expect(createCore).to.be.a('function');
  });

  it('returns App class', function () {
    const MyApp = createCore({
      name: 'MyAppNameFromClass',
    });

    const app = new MyApp({
      name: 'MyAppNameFromInstance',
    });

    expect(app).to.be.instanceOf(App);
    expect(app.getOption('name')).to.equal('MyAppNameFromInstance');
    expect(app.getOption('isFrintCore')).to.equal(true);
  });
});
