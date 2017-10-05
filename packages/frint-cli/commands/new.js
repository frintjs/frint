/* eslint-disable no-use-before-define */

const mkdirp = require('mkdirp');
const request = require('request');
const tar = require('tar');

const createApp = require('frint').createApp;

const DEFAULT_ORGANIZATION = 'Travix-International';
const DEFAULT_REPOSITORY = 'frint';
const DEFAULT_BRANCH = 'master';
const DEFAULT_EXAMPLES_DIR = 'examples';
const DEFAULT_EXAMPLE = 'counter';
const DESCRIPTION_TEXT = `
Usage:

  $ frint new
  $ frint new <directory>
  $ frint new <directory> --example <example>

Example:

  $ frint new myapp --example kitchensink
  $ frint new myapp --example frint-vue/tree/master/examples/basic

You can find a list of all available official examples here:
https://github.com/Travix-International/frint/tree/master/examples
`.trim();
const INVALID_EXAMPLE_ARG_TEXT = `
Invalid <example> value. Must be in one of the following formats:

  * <name>
  * <organization>/<repository>/tree/<branch>/**
`.trim();
const COMPLETION_TEXT = `
Done!

Please run these two commands to start your application:

  $ npm install
  $ npm start
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
      useValue: DESCRIPTION_TEXT,
    },
    {
      name: 'execute',
      useFactory: function useFactory(deps) {
        return function execute() {
          deps.console.log('Initializing...');
          Promise.resolve(deps)
            .then(mapDepsToContext)
            .then(createOutputDirectory)
            .then(streamExampleToOutputDirectory)
            .then(() => deps.console.log(COMPLETION_TEXT))
            .catch(deps.console.error);
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

function mapDepsToContext(deps) {
  return new Promise((resolve, reject) => {
    // The <example> param has two shapes:
    // * <name> - example name from the official Frint GitHub repository
    // * <organization>/<repo>/tree/<branch>/** - full GitHub path to an arbitrary example
    const example = deps.params.example || DEFAULT_EXAMPLE;
    if (!example.match(/(^(\w|-)+$)|^\/?(\w|-)+(\/(\w|-)+){3,}\/?$/)) {
      reject(INVALID_EXAMPLE_ARG_TEXT);
    }

    const isCustomExample = example.indexOf('/') >= 0;
    resolve(isCustomExample ? getContextForCustomRepo() : getContextForDefaultRepo());

    function getContextForDefaultRepo() {
      return {
        organization: DEFAULT_ORGANIZATION,
        repository: DEFAULT_REPOSITORY,
        branch: DEFAULT_BRANCH,
        examplePath: `${DEFAULT_EXAMPLES_DIR}/${example}`,
        outputDirectory: getOutputDirectory(),
      };
    }

    function getContextForCustomRepo() {
      // Split by '/' and filter out empty results.
      // <example> arg might start or end with a separator.
      const exampleParts = example.split('/').filter(str => str !== '');
      return {
        organization: exampleParts[0],
        repository: exampleParts[1],
        branch: exampleParts[3],
        examplePath: exampleParts.slice(4).join('/'),
        outputDirectory: getOutputDirectory(),
      };
    }

    function getOutputDirectory() {
      // If <directory> is specified, it is taken as the 1st value from params _ array.
      // Note that this array does not include the <example> flag.
      return deps.params._.length >= 1 ? deps.params._[0] : deps.pwd;
    }
  });
}

function createOutputDirectory(ctx) {
  return new Promise((resolve, reject) => {
    mkdirp(ctx.outputDirectory, function mkdirpCallback(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(ctx);
    });
  });
}

function streamExampleToOutputDirectory(ctx) {
  return new Promise((resolve, reject) => {
    request(`https://codeload.github.com/${ctx.organization}/${ctx.repository}/tar.gz/${ctx.branch}`)
      .on('error', reject)
      .pipe(tar.x({
        filter: p => p.indexOf(`${ctx.repository}-${ctx.branch}/${ctx.examplePath}/`) === 0,
        strip: 3,
        C: ctx.outputDirectory,
      }))
      .on('error', reject)
      .on('finish', resolve);
  });
}
