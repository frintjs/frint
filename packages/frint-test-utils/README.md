# frint-test-utils

[![npm](https://img.shields.io/npm/v/frint-test-utils.svg)](https://www.npmjs.com/package/frint-test-utils)

> Test utilities for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)
  - [resetDOM](#resetdom)
  - [takeOverConsole](#takeoverconsole)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

```
$ npm install --save-dev frint-test-utils
```

## Usage

With mocha:

```
$ mocha --require frint-test-utils/register './test/**/spec.js'
```

Sets `resetDOM` globally in your environment, and takes over the `console` for hiding deprecated warnings.

---

# API

## resetDOM

> resetDOM()

Resets the DOM using `jsdom`.

### Returns

`void`.

## takeOverConsole

> takeOverConsole(console)

Takes over `console` for hiding deprecated warnings.

### Arguments

1. `console` (`Object`): The console object to take over.

### Returns

`Function`: Call the returned function to undo the take over.
