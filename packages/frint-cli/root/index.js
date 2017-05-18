const fs = require('fs');

const _ = require('lodash');
const createApp = require('frint').createApp;
const argv = require('yargs').argv;

const App = createApp({
  name: 'FrintCLI',
  providers: [
    {
      name: 'pwd',
      useValue: process.env.PWD,
      cascade: true,
    },
    {
      name: 'command',
      useFactory: function () {
        if (argv._[0] !== undefined) {
          return argv._[0];
        }

        // @TODO: default handler
      },
      cascade: true,
    },
    {
      name: 'params',
      useFactory: function () {
        // @TODO: make it better
        const clonedArgv = _.clone(argv);
        clonedArgv._.shift();

        return clonedArgv;
      },
      cascade: true,
    },
    {
      name: 'config',
      useFactory: function (deps) {
        try {
          return JSON.parse(fs.readFileSync(deps.pwd + '/.frintrc', 'utf8'));
        } catch (e) {
          return {};
        }
      },
      deps: ['pwd'],
      cascade: true,
    },
    {
      name: 'console',
      useValue: console,
      cascade: true,
    },
  ],
});

module.exports = App;
