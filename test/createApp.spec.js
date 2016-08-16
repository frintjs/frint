/* global describe, it */
import { expect } from 'chai';

import createApp from '../src/createApp';

describe('createApp', () => {
  beforeEach(() => {
    window.app = null;
  });

  afterEach(() => {
    delete window.app;
  });

  it('creates an instance', () => {
    const App = createApp({
      name: 'MyAppName',
      appId: '123',
      component: true
    });

    const app = new App();

    expect(app).to.be.instanceof(App);
    expect(app.getOption('name')).to.eql('MyAppName');
  });


  it('creates an instance with a validationFunctions option and returns it via getValidationFunctions()', () => {
    const expectedValidationFunctions = ['expectedValue'];
    const App = createApp({
      appId: '123',
      component: true,
      name: 'MyAppName',
      validationFunctions: expectedValidationFunctions,
    });

    const app = new App();

    expect(app).to.be.instanceof(App);
    expect(app.getValidationFunctions()).to.eql(expectedValidationFunctions);
  });

  it('creates a RootApp instance with a validationFunctions option and a ChildApp returns them via getValidationFunctions()', () => {
    const expectedValidationFunctions = ['expectedValue'];
    const unExpectedValidationFunctions = ['unExpectedValue'];
    const RootApp = createApp({
      appId: '123',
      component: true,
      name: 'MyRootAppName',
      validationFunctions: expectedValidationFunctions,
    });
    const rootApp = new RootApp();
    window.app = rootApp;

    const ChildApp = createApp({
      appId: '234',
      component: true,
      name: 'MyChildAppName',
      validationFunctions: unExpectedValidationFunctions
    });
    const childApp = new ChildApp();


    expect(rootApp).to.be.instanceof(RootApp);
    expect(window.app).to.eql(rootApp);

    expect(childApp).to.be.instanceof(ChildApp);

    expect(rootApp.getValidationFunctions()).to.eql(expectedValidationFunctions);
    expect(childApp.getValidationFunctions()).to.eql(expectedValidationFunctions);
  });

  it('creates a RootApp instance without a validationFunctions option and so as the ChildApp. Expects undefined when calling getValidationFunctions()', () => {
    const RootApp = createApp({
      appId: '123',
      component: true,
      name: 'MyRootAppName',
    });
    const rootApp = new RootApp();
    window.app = rootApp;

    const ChildApp = createApp({
      appId: '234',
      component: true,
      name: 'MyChildAppName',
    });
    const childApp = new ChildApp();


    expect(rootApp).to.be.instanceof(RootApp);
    expect(window.app).to.eql(rootApp);

    expect(childApp).to.be.instanceof(ChildApp);

    expect(rootApp.getValidationFunctions()).to.eql(undefined);
    expect(childApp.getValidationFunctions()).to.eql(undefined);

    delete window.app;
  });
});
