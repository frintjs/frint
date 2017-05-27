const fs = require('fs');
const path = require('path');

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
      useFactory: function useFactory() {
        if (argv._[0] !== undefined) {
          return argv._[0];
        }

        // @TODO: default handler
        return null;
      },
      cascade: true,
    },
    {
      name: 'params',
      useFactory: function useFactory() {
        // @TODO: make it better
        const clonedArgv = _.clone(argv);
        clonedArgv._.shift();

        return clonedArgv;
      },
      cascade: true,
    },
    {
      name: 'config',
      useFactory: function useFactory(deps) {
        let config = {};
        const pwd = deps.pwd;

        try {
          config = JSON.parse(fs.readFileSync(`${pwd}/.frintrc`, 'utf8'));
        } catch (e) {
          // do nothing
        }

        if (typeof config.plugins === 'undefined') {
          config.plugins = [];
        }

        config.plugins = config.plugins.map((plugin) => {
          if (plugin.startsWith('.')) {
            return path.join(pwd, plugin);
          }

          return plugin;
        });

        return config;
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
