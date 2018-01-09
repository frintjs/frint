import * as MemoryFs from 'memory-fs';

const fs = new MemoryFs();

export default [
  {
    cascade: true,
    name: 'fs',
    useValue: fs,
  },
  {
    cascade: true,
    name: 'pwd',
    useValue: process.env.PWD,
  },
  {
    cascade: true,
    name: 'command',
    useValue: null,
  },
  {
    cascade: true,
    name: 'params',
    useValue: {
      _: [],
    },
  },
  {
    cascade: true,
    name: 'config',
    useValue: {
      plugins: [],
    },
  },
  {
    cascade: true,
    name: 'console',
    useFactory: function useFactory() {
      const fakeConsole = {
        errors: [],
        logs: [],

        log: function log(message) {
          this.logs.push(message);
        },

        error: function error(message) {
          this.errors.push(message);
        },
      };

      return fakeConsole;
    },
  },
];
