/* eslint-disable global-require, import/no-dynamic-require */
const path = require('path');
const createApp = require('frint').createApp;

module.exports = createApp({
  name: 'version',

  providers: [
    {
      name: 'summary',
      useValue: 'Shows current version number of frint-cli',
    },
    {
      name: 'execute',
      useFactory: function useFactory(deps) {
        return function execute() {
          const pkg = JSON.parse(
            deps.fs.readFileSync(
              path.resolve(`${__dirname}/../package.json`),
            ),
          );

          deps.console.log(`v${pkg.version}`);
        };
      },
      deps: [
        'console',
        'fs',
      ],
    },
  ],
});
