import { expect } from 'chai';

import { App } from './App';
import createApp from './createApp';

describe('frint › createApp', () => {
  it('is a function', () => {
    expect(createApp).to.be.a('function');
  });

  it('returns App class', () => {
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
