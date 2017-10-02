const mkdirp = require('mkdirp');
const request = require('request');
const tar = require('tar');

const createApp = require('frint').createApp;

const descriptionText = `
Usage:

  $ frint new
  $ frint new <name>
  $ frint new <name> --example=<example>
  $ frint new <name> --path=<path> --example=<example>

Example:

  $ frint new myapp --path=frint-vue/tree/master/examples --example=basic

You can find a list of all available official examples here:
https://github.com/Travix-International/frint/tree/master/examples
`.trim();

const invalidPathArgText = `
Invalid <path> value. Must be in the format:
"<organization>/<repository>/tree/<branch>/**/*"
`.trim();

module.exports = createApp({
  name: 'new',
  providers: [
    {
      name: 'summary',
      useValue: 'Scaffolds a new Frint app in specified directory',
    },
    {
      name: 'description',
      useValue: descriptionText,
    },
    {
      name: 'execute',
      useFactory: function useFactory(deps) {
        return function execute() {
          const path = deps.params.path || 'Travix-International/frint/tree/master/examples';
          // Split by '/' and filter out empty results.
          // <path> arg might start or end with the separator.
          const pathComponents = path.split('/').filter(str => str !== '');
          // Must contain at least 4 components: <organization>/<repository>/tree/<branch>.
          if (pathComponents.length < 4) {
            deps.console.error(invalidPathArgText);
            return;
          }
          const organization = pathComponents[0];
          const repository = pathComponents[1];
          const branch = pathComponents[3];
          let rest = pathComponents.slice(4).join('/');
          if (rest !== '') rest += '/';

          const example = deps.params.example || 'counter';

          // Normally, the application name goes to the first slot of params if defined.
          // Note that flags such as <path> and <example> are not part of the _ array.

          // If app name is specified, it is taken as the 1st param.
          // Note that params does not include flags <path> and <example>.
          const dir = deps.params._.length >= 1
            ? deps.params._[0]
            : deps.pwd;

          function streamFrintExampleToDir() {
            request(`https://codeload.github.com/${organization}/${repository}/tar.gz/${branch}`)
              .on('error', deps.console.error)
              .pipe(tar.x({
                filter: p => p.indexOf(`${repository}-${branch}/${rest}${example}/`) === 0,
                strip: 3,
                C: dir,
              }))
              .on('error', deps.console.error)
              .on('finish', () => deps.console.log('Done!'));
          }

          deps.console.log('Initializing...');

          mkdirp(dir, function mkdirpCallback(error) {
            if (error) {
              deps.console.error(error);
              return;
            }
            streamFrintExampleToDir();
          });
        };
      },
      deps: [
        'console',
        'params',
        'pwd',
      ],
    }
  ],
});
