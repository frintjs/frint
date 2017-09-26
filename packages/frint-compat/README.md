# frint-compat

[![npm](https://img.shields.io/npm/v/frint-compat.svg)](https://www.npmjs.com/package/frint-compat)

> Backwards compatibility package for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-compat
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://unpkg.com/frint-compat@latest/dist/frint-compat.min.js"></script>
<script>
  // available as `window.Frint` (now backwards compatible)
</script>
```

## Usage

Load it after you have loaded all other packages:

```js
require('frint-compat');
```

Doing so would mutate other packages to keep them backwards compatible.

# API

n/a
