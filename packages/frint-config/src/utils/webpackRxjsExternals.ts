/* eslint-disable */
/**
 * This file is here because latest `webpack-rxjs-externals`
 * is not on npm yet.
 *
 * My PR there is merged already, but need to wait for npm release.
 *
 * https://github.com/jayphelps/webpack-rxjs-externals
 *
 * Once done, remove this file here.
 */

const rootPatterns = [{
  // rxjs/operators/map
  regex: /^rxjs\/operators\//,
  root: ['Rx', 'operators']
}, {
  // rxjs/operator/map
  regex: /^rxjs\/operator\//,
  root: ['Rx', 'Observable', 'prototype']
}, {
  // rxjs/observable/interval
  regex: /^rxjs\/observable\/[a-z]/,
  root: ['Rx', 'Observable']
}, {
  // rxjs/observable/MulticastObservable
  regex: /^rxjs\/observable\/[A-Z]/,
  root: 'Rx'
}, {
  // rxjs/scheduler/asap
  regex: /^rxjs\/scheduler\/[a-z]/,
  root: ['Rx', 'Scheduler']
}, {
  // rxjs/scheduler/VirtualTimeScheduler
  regex: /^rxjs\/scheduler\/[A-Z]/,
  root: 'Rx'
}];

function rootForRequest(path) {
  const match = rootPatterns.find(pattern => path.match(pattern.regex));

  if (match) {
    return match.root;
  }

  return 'Rx';
}

function rxjsExternalsFactory() {

  return function rxjsExternals(context, request, callback) {

    if (request.startsWith('rxjs/')) {
      return callback(null, {
        root: rootForRequest(request),
        commonjs: request,
        commonjs2: request,
        amd: request
      });
    }

    callback();

  };

}

export default rxjsExternalsFactory;
