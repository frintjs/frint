import * as fs from 'fs';
import * as clone from 'lodash/clone';
import * as path from 'path';
import { argv } from 'yargs';

interface IFrintConfig {
  plugins: string[];
}

export const providers = [
  {
    name: 'fs',
    useValue: fs,
    cascade: true,
  },
  {
    name: 'pwd',
    useValue: process.cwd(),
    cascade: true,
  },
  {
    name: 'command',
    useFactory: function useFactory() {
      if (argv._[0] !== undefined) {
        return argv._[0];
      }

      return null;
    },
    cascade: true,
  },
  {
    name: 'params',
    useFactory: function useFactory() {
      const clonedArgv = clone(argv);
      clonedArgv._.shift();

      return clonedArgv;
    },
    cascade: true,
  },
  {
    name: 'config',
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
    deps: [
      'pwd',
      'fs',
    ],
    cascade: true,
  },
  {
    name: 'console',
    useValue: console,
    cascade: true,
  },
];
