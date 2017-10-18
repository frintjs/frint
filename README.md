# frint

[![npm](https://img.shields.io/npm/v/frint.svg)](https://www.npmjs.com/package/frint) [![Build Status](https://img.shields.io/travis/Travix-International/frint/master.svg)](http://travis-ci.org/Travix-International/frint) [![Coverage](https://img.shields.io/coveralls/Travix-International/frint.svg)](https://coveralls.io/github/Travix-International/frint) [![NSP Status](https://nodesecurity.io/orgs/travix-international-bv/projects/2c3431f8-ed10-4ef2-8edb-4873c656497c/badge)](https://nodesecurity.io/orgs/travix-international-bv/projects/2c3431f8-ed10-4ef2-8edb-4873c656497c) [![Join the chat at https://gitter.im/frintjs/frintjs](https://badges.gitter.im/frintjs/frintjs.svg)](https://gitter.im/frintjs/frintjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> The modular JavaScript framework

For documentation, visit [https://frint.js.org](https://frint.js.org).

This project adheres to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code.
Please report unacceptable behavior to frintjs-conduct@googlegroups.com.

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

| Package                            | Status                                                                               | Description |
|------------------------------------|--------------------------------------------------------------------------------------|-------------|
| [frint]                            | [![frint-status]][frint-package]                                                     | Base for creating Apps |
| [frint-store]                      | [![frint-store-status]][frint-store-package]                                         | State management with reactive stores |
| [frint-data]                       | [![frint-data-status]][frint-data-package]                                           | Reactive data modelling |
| [frint-react]                      | [![frint-react-status]][frint-react-package]                                         | React.js integration |
| [frint-react-server]               | [![frint-react-server-status]][frint-react-server-package]                           | Server-side rendering of Apps |
| [frint-router]                     | [![frint-router-status]][frint-router-package]                                       | Router services for building Single Page Applications |
| [frint-router-react]               | [![frint-router-react-status]][frint-router-react-package]                           | React components for building SPAs |
| [frint-cli]                        | [![frint-cli-status]][frint-cli-package]                                             | CLI runner |
| [frint-compat]                     | [![frint-compat-status]][frint-compat-package]                                       | Backwards compatibility for older versions |
| [frint-model]                      | [![frint-model-status]][frint-model-package]                                         | Use `frint-data` instead |
| **For library developers:**        |                                                                                      |  |
| [frint-component-utils]            | [![frint-component-utils-status]][frint-component-utils-package]                     | Utils for reactive Components |
| [frint-component-handlers]         | [![frint-component-handlers-status]][frint-component-handlers-package]               | Handlers for integrating with other rendering libraries |
| [frint-router-component-handlers]  | [![frint-router-component-handlers-status]][frint-router-component-handlers-package] | Handlers for integrating `frint-router` with other rendering libraries |
| **Internally used:**               |                                                                                      |  |
| [frint-test-utils]                 | [![frint-test-utils-status]][frint-test-utils-package]                               | Internally used test utilities |
| [frint-config]                     | [![frint-config-status]][frint-config-package]                                       | Common config for your Apps |

[frint]: https://frint.js.org/docs/packages/frint
[frint-store]: https://frint.js.org/docs/packages/frint-store
[frint-model]: https://frint.js.org/docs/packages/frint-model
[frint-data]: https://frint.js.org/docs/packages/frint-data
[frint-react]: https://frint.js.org/docs/packages/frint-react
[frint-react-server]: https://frint.js.org/docs/packages/frint-react-server
[frint-router]: https://frint.js.org/docs/packages/frint-router
[frint-router-react]: https://frint.js.org/docs/packages/frint-router-react
[frint-cli]: https://frint.js.org/docs/packages/frint-cli
[frint-compat]: https://frint.js.org/docs/packages/frint-compat
[frint-component-utils]: https://frint.js.org/docs/packages/frint-component-utils
[frint-component-handlers]: https://frint.js.org/docs/packages/frint-component-handlers
[frint-router-component-handlers]: https://frint.js.org/docs/packages/frint-router-component-handlers
[frint-test-utils]: https://frint.js.org/docs/packages/frint-test-utils
[frint-config]: https://frint.js.org/docs/packages/frint-config

[frint-status]: https://img.shields.io/npm/v/frint.svg
[frint-store-status]: https://img.shields.io/npm/v/frint-store.svg
[frint-model-status]: https://img.shields.io/badge/status-deprecated-orange.svg
[frint-data-status]: https://img.shields.io/npm/v/frint-data.svg
[frint-react-status]: https://img.shields.io/npm/v/frint-react.svg
[frint-react-server-status]: https://img.shields.io/npm/v/frint-react-server.svg
[frint-router-status]: https://img.shields.io/npm/v/frint-router.svg
[frint-router-react-status]: https://img.shields.io/npm/v/frint-router-react.svg
[frint-cli-status]: https://img.shields.io/npm/v/frint-cli.svg
[frint-compat-status]: https://img.shields.io/npm/v/frint-compat.svg
[frint-component-utils-status]: https://img.shields.io/npm/v/frint-component-utils.svg
[frint-component-handlers-status]: https://img.shields.io/npm/v/frint-component-handlers.svg
[frint-router-component-handlers-status]: https://img.shields.io/npm/v/frint-router-component-handlers.svg
[frint-test-utils-status]: https://img.shields.io/npm/v/frint-test-utils.svg
[frint-config-status]: https://img.shields.io/npm/v/frint-config.svg

[frint-package]: https://npmjs.com/package/frint
[frint-store-package]: https://npmjs.com/package/frint-store
[frint-model-package]: https://npmjs.com/package/frint-model
[frint-data-package]: https://npmjs.com/package/frint-data
[frint-react-package]: https://npmjs.com/package/frint-react
[frint-react-server-package]: https://npmjs.com/package/frint-react-server
[frint-router-package]: https://npmjs.com/package/frint-router
[frint-router-react-package]: https://npmjs.com/package/frint-router-react
[frint-cli-package]: https://npmjs.com/package/frint-cli
[frint-compat-package]: https://npmjs.com/package/frint-compat
[frint-component-utils-package]: https://npmjs.com/package/frint-component-utils
[frint-component-handlers-package]: https://npmjs.com/package/frint-component-handlers
[frint-router-component-handlers-package]: https://npmjs.com/package/frint-router-component-handlers
[frint-test-utils-package]: https://npmjs.com/package/frint-test-utils
[frint-config-package]: https://npmjs.com/package/frint-config

## Community projects

* [frint-vue](https://github.com/frintjs/frint-vue): Vue.js integration
* [frint-react-native](https://github.com/frintjs/frint-react-native): React Native integration

## License

MIT © [Travix International](http://travix.com)
