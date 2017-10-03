/* eslint-disable no-multi-spaces */

const mkdirp = require('mkdirp');
const request = require('request');
const tar = require('tar');

const createApp = require('frint').createApp;

const descriptionText = `
Usage:

  $ frint new
  $ frint new <directory>
  $ frint new <directory> --example=<example>

Example:

  $ frint new myapp --example=kitchensink
  $ frint new myapp --example=frint-vue/tree/master/examples/basic

You can find a list of all available official examples here:
https://github.com/Travix-International/frint/tree/master/examples
`.trim();

const invalidPathArgText = `
Invalid <example> value. Must be in one of the following formats:

  * <name>
  * <organization>/<repository>/tree/<branch>/**/<name>
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
          // The <example> param has two shapes:
          // * <name> - example name from the official Frint GitHub repository
          // * <organization>/<repo>/tree/<branch>/**/<name> - full GitHub path to arbitrary example
          const example = deps.params.example || 'counter';

          // Split by '/' and filter out empty results.
          // <example> arg might start or end with a separator.
          const exampleComponents = example.split('/').filter(str => str !== '');

          if (exampleComponents.length > 1 && exampleComponents.length < 5) {
            deps.console.error(invalidPathArgText);
            return;
          }

          const isFullExamplePath = exampleComponents.length > 1;

          const organization = isFullExamplePath ? exampleComponents[0] : 'Travix-International';
          const repository   = isFullExamplePath ? exampleComponents[1] : 'frint';
          const branch       = isFullExamplePath ? exampleComponents[3] : 'master';
          const rest         = isFullExamplePath ? exampleComponents.slice(4).join('/') : `examples/${example}`;

          // If <directory> is specified, it is taken as the 1st value from params _ array.
          // Note that this array does not include the <example> flag.
          const directory = deps.params._.length >= 1
            ? deps.params._[0]
            : deps.pwd;

          function streamFrintExampleToDir() {
            request(`https://codeload.github.com/${organization}/${repository}/tar.gz/${branch}`)
              .on('error', deps.console.error)
              .pipe(tar.x({
                filter: p => p.indexOf(`${repository}-${branch}/${rest}/`) === 0,
                strip: 3,
                C: directory,
              }))
              .on('error', deps.console.error)
              .on('finish', () => deps.console.log('Done!'));
          }

          deps.console.log('Initializing...');

          mkdirp(directory, function mkdirpCallback(error) {
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
