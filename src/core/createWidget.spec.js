/* global describe, it */
import { expect } from 'chai';

import App from '../App';
import createWidget from '../createWidget';

describe('core › createWidget', function () {
  it('is a function', function () {
    expect(createWidget).to.be.a('function');
  });

  it('returns App class', function () {
    const MyApp = createWidget({
      name: 'MyAppNameFromClass',
    });

    const app = new MyApp({
      name: 'MyAppNameFromInstance',
    });

    expect(app).to.be.instanceOf(App);
    expect(app.getOption('name')).to.equal('MyAppNameFromInstance');
    expect(app.getOption('isFrintWidget')).to.equal(true);
  });
});
