/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
const expect = require('chai').expect;
const App = require('frint').App;

const createRootApp = require('../root/index.mock');
const CommandApp = require('./init');

describe('frint-cli › commands › init', function () {
  it('is a Frint App', function () {
    const RootApp = createRootApp();
    const rootApp = new RootApp();
    rootApp.registerApp(CommandApp);
    const commandApp = rootApp.getAppInstance('init');

    expect(commandApp).to.be.an.instanceOf(App);
  });
});
