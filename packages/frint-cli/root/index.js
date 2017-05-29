const createApp = require('frint').createApp;

const providers = require('./providers');

const App = createApp({
  name: 'FrintCLI',

  providers: providers,
});

module.exports = App;
