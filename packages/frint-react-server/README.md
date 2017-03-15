# frint-react-server

[![npm](https://img.shields.io/npm/v/frint-react-server.svg)](https://www.npmjs.com/package/frint-react-server)

> Server-side React package for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)
  - [renderToString](#rendertostring)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

```
$ npm install --save react react-dom frint-react frint-react-server
```

## Usage

```js
import { renderToString } from 'frint-react-server';

// import your App
import App from './path/to/core';

const app = new App();
const htmlOutput = renderToString(app);
```

---

# API

## renderToString

> renderToString(app)

### Arguments

1. `app` (`App`): The Root App or Widget's instance

### Returns

`String`: HTML output as a string.
