# react-server

> Server-side React plugin for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Usage](#usage)
- [API](#api)
  - [renderToString](#rendertostring)

<!-- /MarkdownTOC -->

---

# Guide

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

1. `app` (`App`): The Core App or Widget's instance

### Returns

`String`: HTML output as a string.
