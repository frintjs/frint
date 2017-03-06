# frint

Everything internally in the repository is a plugin. Most of them are composed together and shipped as a single exported module for convenience.

## Base

* [frint](./frint): The primary base with built-in plugin system

## Plugins

These are the plugins that are composed and shipped together with the exported module:

* [core](./core): For creating Apps (Core and Widgets), as well as the base for dependency injection.
* [store](./store): For creating reactive reducer-based stores for state management.
* [model](./model): For creating models for data structures.
* [react](./react): For creating React-compatible reactive components.
* [compat](./compat): Backwards compatibility plugin for supporting `v0.x` users.

These plugins are not available in the exported module directly, and need to be loaded manually:

* [react-server](./react-server): Server-side rendering for Apps

### Installation

A plugin can be installed simply by doing:

```js
const Frint = require('frint');
const FrintReactServer = require('frint/lib/react-server');
const FrintFoo = require('frint-plugin-foo');

Frint.use(FrintReactServer);
Frint.use(FrintFoo);
```
