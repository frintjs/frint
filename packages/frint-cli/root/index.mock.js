const createApp = require('frint').createApp;

const providers = require('./providers.mock');

module.exports = function createMockedRootApp() {
  const options = arguments[0] || {}; // eslint-disable-line
  const overrideProviders = options.providers || [];

  return createApp({
    name: 'FrintCLI Mocked',

    providers: overrideProviders.reduce((acc, provider) => {
      const index = providers.findIndex(item => item.name === provider.name);

      if (index > -1) {
        acc[index] = provider;
      }

      return acc;
    }, providers)
  });
};
