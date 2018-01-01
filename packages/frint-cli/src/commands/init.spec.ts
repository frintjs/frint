import { expect } from 'chai';
import { App } from 'frint';
import 'mocha';

import createRootApp from '../index.mock';
import InitCommand from './init';

describe('frint-cli › commands › init', () => {
  it('is a Frint App', () => {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(InitCommand);
    const commandApp = rootApp.getAppInstance('init');

    expect(commandApp).to.be.an.instanceOf(App);
  });
});
