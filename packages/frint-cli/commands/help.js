/* eslint-disable global-require, import/no-dynamic-require */
const createApp = require('frint').createApp;

const descriptionText = `
Usage:

  $ frint help <commandName>

Example:

  $ frint help init
`.trim();

module.exports = createApp({
  name: 'help',

  providers: [
    {
      name: 'summary',
      useValue: 'Shows help text for commands',
    },
    {
      name: 'description',
      useValue: descriptionText,
    },
    {
      name: 'execute',
      useFactory: function useFactory(deps) {
        return function execute() {
          const commandName = deps.params._[0];

          if (typeof commandName === 'undefined') {
            return deps.console.error('Must provide a command name as argument.');
          }

          const commandApp = deps.rootApp.getAppInstance(commandName);

          if (!commandApp) {
            return deps.console.error(`No command found with name: ${commandName}`);
          }

          const output = [
            commandApp.get('summary'),
            commandApp.get('description'),
          ]
            .filter(text => text)
            .join('\n\n');

          return deps.console.log(output);
        };
      },
      deps: [
        'console',
        'params',
        'rootApp',
      ],
    }
  ],
});
