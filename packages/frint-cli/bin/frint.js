#!/usr/bin/env node
/* eslint-disable no-console */

const App = require('../root');

const app = new App();

app.registerApp(require('../commands/version'));
app.registerApp(require('../commands/init'));

const command = app.get('command');

function run() {
  if (!command) {
    console.log(app.getOption('helpText'));
    console.log('\n');

    console.log('These commands are currently available:\n');

    return app.getApps$()
      .map((registeredApps) => {
        return registeredApps
          .map(registeredApp => registeredApp.name)
          .sort();
      })
      .take(1)
      .map((registeredAppNames) => {
        registeredAppNames
          .map(appName => `  - ${appName}`)
          .join('\n');
      })
      .subscribe(names => console.log(names));
  }

  return app.getApps$()
    .map((list) => {
      const filtered = list.filter(a => a.name === command);

      return filtered[filtered.length - 1];
    })
    .do(a => {
      if (!a) {
        // @TODO: show better message
        return console.log('Command not available.');
      }

      return a.instances.default.get('execute')();
    })
    .subscribe();
}

run();
