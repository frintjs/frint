import { expect } from 'chai';
import { App } from 'frint';
import 'mocha';

import createRootApp from '../root/index.mock';
import NewCommand from './new';

describe('frint-cli › commands › new', () => {
  it('is a Frint App', () => {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(NewCommand);
    const commandApp = rootApp.getAppInstance('new');

    expect(commandApp).to.be.an.instanceOf(App);
  });
});
