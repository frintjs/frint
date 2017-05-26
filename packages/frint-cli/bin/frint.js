#!/usr/bin/env node
/* eslint-disable no-console */

const App = require('../root');

const app = new App();

app.registerApp(require('../commands/version'));
app.registerApp(require('../commands/init'));

const command = app.get('command');

function run() {
  if (!command) {
    // @TODO: welcome
    return console.log('welcome...');
  }

  return app.getApps$()
    .map(function doMap(list) {
      const filtered = list.filter(function doFilter(a) {
        return a.name === command;
      });

      return filtered[filtered.length - 1];
    })
    .do(function doDo(a) {
      if (!a) {
        // @TODO: show better message
        return console.log('Command not available.');
      }

      return a.instances.default.get('execute')();
    })
    .subscribe();
}

run();
