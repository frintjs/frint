# frint

[![npm](https://img.shields.io/npm/v/frint.svg)](https://www.npmjs.com/package/frint) [![Build Status](https://img.shields.io/travis/Travix-International/frint/master.svg)](http://travis-ci.org/Travix-International/frint) [![Coverage](https://img.shields.io/coveralls/Travix-International/frint.svg)](https://coveralls.io/github/Travix-International/frint) [![NSP Status](https://nodesecurity.io/orgs/travix-international-bv/projects/2c3431f8-ed10-4ef2-8edb-4873c656497c/badge)](https://nodesecurity.io/orgs/travix-international-bv/projects/2c3431f8-ed10-4ef2-8edb-4873c656497c)

> The modular JavaScript framework

For documentation, visit [https://frint.js.org](https://frint.js.org).

## Installation

With **npm**:

```
$ npm install --save frint
```

## Packages

The framework is a collection of these packages, which can be composed together on demand:

* [frint](./packages/frint): The base of the framework.
* [frint-store](./packages/frint-store): For creating reactive reducer-based stores for state management.
* [frint-model](./packages/frint-model): For creating models for data structures.
* [frint-react](./packages/frint-react): For creating React-compatible reactive components.
* [frint-react-server](./packages/frint-react-server): Server-side rendering for Apps.
* [frint-test-utils](./packages/frint-test-utils): Test utilities.
* [frint-compat](./packages/frint-compat): Backwards compatibility plugin for supporting `v0.x` users.

## Development

We use [Lerna](https://github.com/lerna/lerna/) for managing our monorepo. All our packages can be found in [packages](./packages) directory.

To start developing the framework itself:

```
$ npm install
$ npm bootstrap
```

Now you can run:

```
$ npm run lint
$ npm run test
$ npm run cover
```

Which are shortcuts for:

```
$ ./node_modules/.bin/lerna run lint
$ ./node_modules/.bin/lerna run test
$ ./node_modules/.bin/lerna run cover
```

## License

MIT © [Travix International](http://travix.com)
