/* eslint-disable no-multi-spaces, no-use-before-define */

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
            .then(() => deps.console.log('Done!'))
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
    const ctx = {};

    // The <example> param has two shapes:
    // * <name> - example name from the official Frint GitHub repository
    // * <organization>/<repo>/tree/<branch>/** - full GitHub path to an arbitrary example
    const example = deps.params.example || DEFAULT_EXAMPLE;
    if (!example.match(/(^(\w|-)+$)|^\/?(\w|-)+(\/(\w|-)+){3,}\/?$/)) {
      reject(INVALID_EXAMPLE_ARG_TEXT);
    }

    // Split by '/' and filter out empty results.
    // <example> arg might start or end with a separator.
    const exampleParts = example.split('/').filter(str => str !== '');

    const isFullExamplePath = exampleParts.length > 1;

    ctx.organization = isFullExamplePath ? exampleParts[0]                 : DEFAULT_ORGANIZATION;
    ctx.repository   = isFullExamplePath ? exampleParts[1]                 : DEFAULT_REPOSITORY;
    ctx.branch       = isFullExamplePath ? exampleParts[3]                 : DEFAULT_BRANCH;
    ctx.examplePath  = isFullExamplePath ? exampleParts.slice(4).join('/') : `${DEFAULT_EXAMPLES_DIR}/${example}`;

    // If <directory> is specified, it is taken as the 1st value from params _ array.
    // Note that this array does not include the <example> flag.
    ctx.outputDirectory = deps.params._.length >= 1 ? deps.params._[0] : deps.pwd;

    resolve(ctx);
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
