# frint

[![npm](https://img.shields.io/npm/v/frint.svg)](https://www.npmjs.com/package/frint) [![Build Status](https://img.shields.io/travis/Travix-International/frint/master.svg)](http://travis-ci.org/Travix-International/frint) [![Coverage](https://img.shields.io/coveralls/Travix-International/frint.svg)](https://coveralls.io/github/Travix-International/frint) [![NSP Status](https://nodesecurity.io/orgs/travix-international-bv/projects/2c3431f8-ed10-4ef2-8edb-4873c656497c/badge)](https://nodesecurity.io/orgs/travix-international-bv/projects/2c3431f8-ed10-4ef2-8edb-4873c656497c) [![Join the chat at https://gitter.im/frintjs/frintjs](https://badges.gitter.im/frintjs/frintjs.svg)](https://gitter.im/frintjs/frintjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> The modular JavaScript framework

For documentation, visit [https://frint.js.org](https://frint.js.org).

## Quick start

Install [`frint-cli`](https://frint.js.org/docs/packages/frint-cli/):

```
$ npm install -g frint-cli
```

Create a new empty directory:

```
$ mkdir my-directory && cd my-directory
```

Initialize an example app:

```
$ frint init --example kitchensink
```

Now you can install all the dependencies, and start the application:

```
$ npm install
$ npm start
```

Find more examples [here](https://github.com/Travix-International/frint/tree/master/examples).

## Packages

The framework is a collection of these packages, which can be composed together on demand:

* [frint](./packages/frint): The base of the framework.
* [frint-store](./packages/frint-store): For creating reactive reducer-based stores for state management.
* [frint-model](./packages/frint-model): For creating models for data structures.
* [frint-react](./packages/frint-react): For creating React-compatible reactive components.
* [frint-react-server](./packages/frint-react-server): Server-side rendering for Apps.
* [frint-test-utils](./packages/frint-test-utils): Test utilities.
* [frint-cli](./packages/frint-cli): CLI runner.
* [frint-compat](./packages/frint-compat): Backwards compatibility plugin for supporting `v0.x` users.

## License

MIT © [Travix International](http://travix.com)
