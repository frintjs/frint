/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
const path = require('path');

const expect = require('chai').expect;
const App = require('frint').App;

const createRootApp = require('../root/index.mock');
const CommandApp = require('./version');

describe('frint-cli › commands › version', function () {
  it('is a Frint App', function () {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(CommandApp);
    const commandApp = rootApp.getAppInstance('version');

    expect(commandApp).to.be.an.instanceOf(App);
  });

  it('prints version number', function () {
    const RootApp = createRootApp({
      providers: [
        {
          name: 'command',
          useValue: 'version',
          cascade: true,
        },
      ],
    });
    const rootApp = new RootApp();
    rootApp.registerApp(CommandApp);
    const commandApp = rootApp.getAppInstance('version');
    const fakeConsole = rootApp.get('console');

    rootApp.get('fs').mkdirpSync(
      path.resolve(`${__dirname}/../`)
    );
    rootApp.get('fs').writeFileSync(
      path.resolve(`${__dirname}/../package.json`),
      '{"version": "1.2.3"}'
    );

    commandApp.get('execute')();

    expect(fakeConsole.logs.length).to.equal(1);
    expect(fakeConsole.logs[0]).to.contain('v1.2.3');
  });
});
