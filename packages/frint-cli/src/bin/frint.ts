#!/usr/bin/env node
import { map, take, tap } from 'rxjs/operators';

import HelpCommand from '../commands/help';
import InitCommand from '../commands/init';
import NewCommand from '../commands/new';
import VersionCommand from '../commands/version';

import { FrintCliProvider } from '../FrintCliProvider';
import { App } from '../index';

const app = new App();

app.registerApp(HelpCommand);
app.registerApp(InitCommand);
app.registerApp(NewCommand);
app.registerApp(VersionCommand);

const command = app.get('command');
const config = app.get('config');

// register custom plugins
if (Array.isArray(config.plugins)) {
  config.plugins.forEach((plugin) => {
    const CommandApp = require(plugin);

    if (!Array.isArray(CommandApp)) {
      return app.registerApp(CommandApp);
    }

    return CommandApp.forEach(PluginApp => app.registerApp(PluginApp));
  });
}

function run() {
  if (!command) {
    console.log('Welcome to frint-cli!');
    console.log('\n');
    console.log('These commands are currently available:\n');

    return app.getApps$()
      .pipe(
        map(registeredApps => (
          registeredApps
            .map(registeredApp => registeredApp.name)
            .sort()
        )),
        take(1),
        map(registeredAppNames => (
          registeredAppNames
            .map(appName => `  - ${appName}`)
            .join('\n')
        )),
        tap(names => console.log(names)),
        tap(() => console.log('\n')),
        tap(() => console.log('Type `frint help <commandName>` to learn more.'))
      )
      .subscribe();
  }

  const commandApp = app.getAppInstance(command);

  if (!commandApp) {
    return console.log('Command not available.');
  }

  return commandApp.get<FrintCliProvider>('execute')();
}

run();
