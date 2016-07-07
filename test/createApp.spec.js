/* global describe, it */
import { expect } from 'chai';

import createApp from '../src/createApp';

describe('createApp', function () {
  it('creates an instance', function () {
    const App = createApp({
      name: 'MyAppName',
      appId: '123',
      component: true
    });

    const app = new App();

    expect(app).to.be.instanceof(App);
    expect(app.getOption('name')).to.eql('MyAppName');
  });
});
