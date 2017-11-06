# frint-cli

[![npm](https://img.shields.io/npm/v/frint-cli.svg)](https://www.npmjs.com/package/frint-cli)

> CLI for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Built-in commands](#built-in-commands)
  - [Using plugins](#using-plugins)
  - [Developing your own plugin](#developing-your-own-plugin)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install -g frint-cli
```

## Usage

From your Terminal:

```
$ frint
```

Will list all the commands available to you.

## Built-in commands

### `init`

Scaffolds a new FrintJS application in the current directory:

```
$ mkdir my-directory && cd my-directory
$ frint init
```

To scaffold a certain example, as available in the repository [here](https://github.com/frintjs/frint/tree/master/examples):

```
$ frint init --example kitchensink
```

### `new`

Scaffolds a new FrintJS application in the current directory:

```
$ mkdir my-directory && cd my-directory
$ frint new
```

Scaffolds a new FrintJS application in the specified directory:

```
$ frint new my-directory
```

To scaffold a certain example, as available in the repository [here](https://github.com/Travix-International/frint/tree/master/examples):

```
$ frint new my-directory --example kitchensink
```

It is also possible to scaffold an example from an arbitrary repository:

```
$ frint new my-directory --example frintjs/frint-vue/tree/master/examples/basic
```

### `version`

Shows the current version of `frint-cli`:

```
$ frint version
```

### `help`

Shows help text of commands:

```
$ frint help init
$ frint help help
```

## Using plugins

You can install `frint-cli` plugins just like a regular npm package in your project:

```
$ npm install --save frint-cli-hello
```

### `.frintrc`

To register this new CLI plugin, update your `.frintrc` file in your project's root directory:

```js
{
  "plugins": [
    "frint-cli-hello",
    "./some-relative/path"
  ]
}
```

### Run the plugin

Now the `frint-cli-hello` plugin can be run as:

```
$ frint hello
world
```

## Developing your own plugin

Building a plugin for `frint-cli`, is just like developing a regular FrintJS app.

```js
// frint-cli-hello/index.js
const createApp = require('frint').createApp;

module.exports = createApp({
  name: 'hello', // this is the subcommand name in `$ frint hello`

  providers: [
    {
      name: 'summary',
      useValue: 'Short help text',
    },
    {
      name: 'description',
      useValue: 'Long help text',
    },
    {
      name: 'execute',
      useFactory: function () {
        return function () { // this returned function will be excuted
          console.log('world!');
        }
      },
    }
  ],
});
```

It is required that you have a provider called `execute`, which returns a function. This function will then be called when the subcommand is run.

To register multiple commands from the same plugin, you can export an array of App classes.

The `summary` and `description` is used when the user is trying to get help text by running:

```
$ frint help hello
```

### Providers available in plugins

* `console` (`Console`): The same `console` available in NodeJS globally
* `pwd` (`String`): Current working directory
* `config` (`Object`): As available in `.frintrc` file
* `params` (`Object`): An [yargs](https://www.npmjs.com/package/yargs) compatible object after parsing CLI options
* `fs` (`Object`): Node's `fs` module
