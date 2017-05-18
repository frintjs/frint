#!/usr/bin/env node

const App = require('../root');
const app = new App();

app.registerApp(require('../commands/version'));
app.registerApp(require('../commands/init'));

const command = app.get('command');

if (!command) {
  // @TODO: welcome
  return console.log('welcome...');
}

app.getApps$()
  .map(function (list) {
    const filtered = list.filter(function (a) {
      return a.name === command;
    });

    return filtered[filtered.length - 1];
  })
  .do(function (a) {
    if (!a) {
      // @TODO: show better message
      return console.log('Command not available.');
    }

    a.instances.default.get('execute')();
  })
  .subscribe();
