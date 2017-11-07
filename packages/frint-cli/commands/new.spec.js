/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
const expect = require('chai').expect;
const App = require('frint').App;

const createRootApp = require('../root/index.mock');
const CommandApp = require('./new');

describe('frint-cli › commands › new', function () {
  it('is a Frint App', function () {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(CommandApp);
    const commandApp = rootApp.getAppInstance('new');

    expect(commandApp).to.be.an.instanceOf(App);
  });
});
