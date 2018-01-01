import { createApp } from 'frint';
import * as mkdirp from 'mkdirp';
import * as request from 'request';
import * as tar from 'tar';

const DEFAULT_ORG = 'frintjs';
const DEFAULT_REPO = 'frint';
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
https://github.com/frintjs/frint/tree/master/examples
`.trim();
const INVALID_EXAMPLE_ARG_TEXT = `
Invalid <example> value. Must be in one of the following formats:

  * <name>
  * <organization>/<repository>/tree/<branch>/**
`.trim();
const COMPLETION_TEXT = `
Done!

Please run these two commands to start your application:
{}
  $ npm install
  $ npm start
`.trim();

export default createApp({
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
            .then(mapDepsToCtx)
            .then(createOutputDir)
            .then(streamExampleToOutputDir)
            .then(ctx => deps.console.log(getCompletionText(ctx)))
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

function mapDepsToCtx(deps) {
  return new Promise((resolve, reject) => {
    // The <example> param has two shapes:
    // * <name> - example name from the official Frint GitHub repository
    // * <organization>/<repo>/tree/<branch>/** - full GitHub path to an arbitrary example
    const example = deps.params.example || DEFAULT_EXAMPLE;
    if (!example.match(/(^(\w|-)+$)|^\/?(\w|-)+(\/(\w|-)+){3,}\/?$/)) {
      reject(INVALID_EXAMPLE_ARG_TEXT);
    }

    // If <directory> is specified, it is taken as the 1st value from params _ array.
    // Note that this array does not include the <example> flag.
    const isOutputCurrentDir = deps.params._.length === 0;

    const ctx = {
      isOutputCurrentDir,
      outputDir: isOutputCurrentDir ? deps.pwd : deps.params._[0],
    };

    const isCustomExample = example.indexOf('/') >= 0;
    if (isCustomExample) {
      populateCtxForCustomRepo(ctx, example);
    } else {
      populateCtxForDefaultRepo(ctx, example);
    }

    resolve(ctx);
  });
}

function populateCtxForCustomRepo(ctx, example) {
  // Split by '/' and filter out empty results.
  // <example> arg might start or end with a separator.
  const exampleParts = example.split('/').filter(str => str !== '');
  ctx.org = exampleParts[0];
  ctx.repo = exampleParts[1];
  ctx.branch = exampleParts[3];
  ctx.examplePath = exampleParts.slice(4).join('/');
}

function populateCtxForDefaultRepo(ctx, example) {
  ctx.org = DEFAULT_ORG;
  ctx.repo = DEFAULT_REPO;
  ctx.branch = DEFAULT_BRANCH;
  ctx.examplePath = `${DEFAULT_EXAMPLES_DIR}/${example}`;
}

function createOutputDir(ctx) {
  return new Promise((resolve, reject) => {
    mkdirp(ctx.outputDir, function mkdirpCallback(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(ctx);
    });
  });
}

function streamExampleToOutputDir(ctx) {
  return new Promise((resolve, reject) => {
    request(`https://codeload.github.com/${ctx.org}/${ctx.repo}/tar.gz/${ctx.branch}`)
      .on('error', reject)
      .pipe(tar.x({
        filter: p => p.indexOf(`${ctx.repo}-${ctx.branch}/${ctx.examplePath}/`) === 0,
        strip: 3,
        C: ctx.outputDir,
      }))
      .on('error', reject)
      .on('finish', () => resolve(ctx));
  });
}

function getCompletionText(ctx) {
  return COMPLETION_TEXT.replace(
    '{}',
    ctx.isOutputCurrentDir ? '' : `\n  $ cd ${ctx.outputDir}`);
}
