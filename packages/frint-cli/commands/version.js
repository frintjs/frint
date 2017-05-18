const createApp = require('frint').createApp;

module.exports = createApp({
  name: 'version',

  help: 'Help text here...',

  providers: [
    {
      name: 'execute',
      useFactory: function (deps) {
        return function () {
          const pkg = require('../../package.json');
          deps.console.log('v' + pkg.version);
        };
      },
      deps: ['console'],
    }
  ],
});
