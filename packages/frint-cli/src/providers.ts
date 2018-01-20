import * as fs from 'fs';
import { clone } from 'lodash';
import * as path from 'path';
import { argv } from 'yargs';

interface IFrintConfig {
  plugins: string[];
}

export const providers = [
  {
    name: 'fs',
    cascade: true,
    useValue: fs,
  },
  {
    name: 'pwd',
    cascade: true,
    useValue: process.cwd(),
  },
  {
    name: 'command',
    cascade: true,
    useFactory: function useFactory() {
      if (argv._[0] !== undefined) {
        return argv._[0];
      }

      return null;
    },
  },
  {
    name: 'params',
    cascade: true,
    useFactory: function useFactory() {
      const clonedArgv = clone(argv);
      clonedArgv._.shift();

      return clonedArgv;
    },
  },
  {
    name: 'config',
    cascade: true,
    deps: [
      'pwd',
      'fs',
    ],
    useFactory: function useFactory(deps) {
      let config: IFrintConfig = { plugins: [] };
      const pwd = deps.pwd;

      try {
        config = JSON.parse(deps.fs.readFileSync(`${pwd}/.frintrc`, 'utf8'));
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
  },
  {
    name: 'console',
    cascade: true,
    useValue: console,
  },
];
