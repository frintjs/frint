const mkdirp = require('mkdirp');
const request = require('request');
const tar = require('tar');

const createApp = require('frint').createApp;

const descriptionText = `
Usage:

  $ frint init
  $ frint init --example exampleName

Example:

  $ mkdir my-new-directory
  $ cd my-new-directory

  $ frint init --example kitchensink

You can find list of all available examples here:
https://github.com/Travix-International/frint/tree/master/examples
`.trim();

module.exports = createApp({
  name: 'init',
  providers: [
    {
      name: 'summary',
      useValue: 'Scaffolds a new Frint app in current working directory',
    },
    {
      name: 'description',
      useValue: descriptionText,
    },
    {
      name: 'execute',
      useFactory: function useFactory(deps) {
        return function execute() {
          const example = deps.params.example || 'counter';
          const dir = deps.pwd;

          function streamFrintExampleToDir() {
            request('https://codeload.github.com/Travix-International/frint/tar.gz/master')
              .on('error', deps.console.error)
              .pipe(tar.x({
                filter: path => path.indexOf(`frint-master/examples/${example}/`) === 0,
                strip: 3,
                C: dir
              }))
              .on('error', deps.console.error)
              .on('finish', () => deps.console.log('Done!'));
          }

          deps.console.log('Initializing...');

          mkdirp(dir, function (error) {
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
