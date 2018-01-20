import { expect } from 'chai';
import { App } from 'frint';
import 'mocha';
import * as path from 'path';

import { IFrintCliProvider } from '../IFrintCliProvider';
import createRootApp from '../index.mock';
import VersionCommand from './version';

describe('frint-cli › commands › version', () => {
  it('is a Frint App', () => {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(VersionCommand);
    const commandApp = rootApp.getAppInstance('version');

    expect(commandApp).to.be.an.instanceOf(App);
  });

  it('prints version number', () => {
    const RootApp = createRootApp({
      providers: [
        {
          name: 'command',
          cascade: true,
          useValue: 'version',
        },
      ],
    });
    const rootApp = new RootApp();
    rootApp.registerApp(VersionCommand);
    const commandApp = rootApp.getAppInstance('version');
    const fakeConsole = rootApp.get('console');

    rootApp.get('fs').mkdirpSync(
      path.resolve(`${__dirname}/../../`)
    );
    rootApp.get('fs').writeFileSync(
      path.resolve(`${__dirname}/../../package.json`),
      '{"version": "1.2.3"}'
    );

    commandApp.get<IFrintCliProvider>('execute')();

    expect(fakeConsole.logs.length).to.equal(1);
    expect(fakeConsole.logs[0]).to.contain('v1.2.3');
  });
});
