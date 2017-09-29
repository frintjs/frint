const mkdirp = require('mkdirp');
const request = require('request');
const tar = require('tar');

const createApp = require('frint').createApp;

const descriptionText = `
Usage:

  $ frint new
  $ frint new <app-name>
  $ frint new --example=<example-name> <app-name>
  $ frint new --repo=<repo-path> --example=<example-name> <app-name>

Example:

  $ frint new --repo=/frint-vue/tree/master/examples --example=basic my-app

You can find list of all available examples here:
https://github.com/Travix-International/frint/tree/master/examples
`.trim();

const invalidRepoArgText = `
Invalid repo value
Must be in the format: "<organization>/<repository>/**/*"
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
          const repo = deps.params.repo || 'Travix-International/frint/examples';
          // Since the repo arg might start or end with a '/', this would cause empty strings
          // in the components array after split. We make sure to filter out empty values.
          const repoComponents = repo.split('/').filter(str => str !== '');
          // Must contains at least two components: organization and repository.
          if (repoComponents.length < 2) {
            deps.console.error(invalidRepoArgText);
            return;
          }

          const branch = deps.params.branch || 'master';

          const example = deps.params.example || 'counter';
          let dir = deps.params.name || deps.pwd;
          // Normally, the application name goes to the first slot of params if defined.
          // Note that flags are not part of the _ array.
          if (deps.params._.length >= 1) {
            dir = deps.params._[0];
          }

          // TEMP
          console.log(deps.params);
          console.log(repo);
          console.log(repoComponents);
          console.log(example);
          console.log(dir);

          function streamFrintExampleToDir() {
            const organization = repoComponents[0];
            const name = repoComponents[1];
            let rest = repoComponents.slice(2).join('/');
            if (rest !== '') rest += '/';

            request(`https://codeload.github.com/${organization}/${name}/tar.gz/${branch}`)
              .on('error', deps.console.error)
              .pipe(tar.x({
                filter: p => p.indexOf(`${name}-${branch}/${rest}${example}/`) === 0,
                strip: 3,
                C: dir
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
