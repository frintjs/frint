import * as MemoryFs from 'memory-fs';

const fs = new MemoryFs();

export default [
  {
    name: 'fs',
    cascade: true,
    useValue: fs,
  },
  {
    name: 'pwd',
    cascade: true,
    useValue: process.env.PWD,
  },
  {
    name: 'command',
    cascade: true,
    useValue: null,
  },
  {
    name: 'params',
    cascade: true,
    useValue: {
      _: [],
    },
  },
  {
    name: 'config',
    cascade: true,
    useValue: {
      plugins: [],
    },
  },
  {
    name: 'console',
    cascade: true,
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
