import { expect } from 'chai';
import { App } from 'frint';
import 'mocha';

import { FrintCliProvider } from '../FrintCliProvider';
import createRootApp from '../index.mock';
import HelpCommand from './help';

describe('frint-cli › commands › help', () => {
  it('is a Frint App', () => {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(HelpCommand);
    const commandApp = rootApp.getAppInstance('help');

    expect(commandApp).to.be.an.instanceOf(App);
  });

  it('prints error when run without any command name', () => {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(HelpCommand);
    const commandApp = rootApp.getAppInstance('help');
    const fakeConsole = rootApp.get('console');

    commandApp.get<FrintCliProvider>('execute')();

    expect(fakeConsole.errors.length).to.equal(1);
    expect(fakeConsole.errors[0]).to.contain('Must provide a command name');
  });

  it('prints help text when run with a command name', () => {
    const RootApp = createRootApp({
      providers: [
        {
          name: 'command',
          useValue: 'help',
          cascade: true,
        },
        {
          name: 'params',
          useValue: {
            _: ['help'],
          },
          cascade: true,
        },
      ],
    });
    const rootApp = new RootApp();
    rootApp.registerApp(HelpCommand);
    const commandApp = rootApp.getAppInstance('help');
    const fakeConsole = rootApp.get('console');

    commandApp.get<FrintCliProvider>('execute')();

    expect(fakeConsole.logs.length).to.equal(1);
  });
});
