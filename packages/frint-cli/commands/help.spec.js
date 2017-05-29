/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
const expect = require('chai').expect;
const App = require('frint').App;

const createRootApp = require('../root/index.mock');
const CommandApp = require('./help');

describe('frint-cli › commands › help', function () {
  it('is a Frint App', function () {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(CommandApp);
    const commandApp = rootApp.getAppInstance('help');

    expect(commandApp).to.be.an.instanceOf(App);
  });

  it('prints error when run without any command name', function () {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(CommandApp);
    const commandApp = rootApp.getAppInstance('help');
    const fakeConsole = rootApp.get('console');

    commandApp.get('execute')();

    expect(fakeConsole.errors.length).to.equal(1);
    expect(fakeConsole.errors[0]).to.contain('Must provide a command name');
  });

  it('prints help text when run with a command name', function () {
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
    rootApp.registerApp(CommandApp);
    const commandApp = rootApp.getAppInstance('help');
    const fakeConsole = rootApp.get('console');

    commandApp.get('execute')();

    expect(fakeConsole.logs.length).to.equal(1);
  });
});
