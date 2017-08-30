# frint-component-handlers

[![npm](https://img.shields.io/npm/v/frint-component-handlers.svg)](https://www.npmjs.com/package/frint-component-handlers)

> Component handlers package of Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
- [API](#api)
  - [RegionHandler](#regionhandler)
  - [ObserveHandler](#observehandler)
  - [RegionService](#regionservice)

<!-- /MarkdownTOC -->

---

# Guide

This package is aimed at enabling other reactive rendering/templating libraries integrate with FrintJS, and not to be used directly by developers in their applications.

For example, take a look at `frint-react` for its implementation using this package internally.

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-component-handlers
```

# API

## RegionHandler

> RegionHandler

Handler for creating `Region` component.

## ObserveHandler

> ObserveHandler

Handler for creating `observe` higher-order component.

## RegionService

> RegionService

If your App wishes to receive data coming from the Region component it's rendered in, RegionService is your way to access it.

Methods exposed by the instance:

### emit

> emit(props)

The props that need to be emitted (Region component uses it internally).

#### Arguments

1. `props` (`Object`)

#### Returns

`void`.

### getProps$

> getProps$()

#### Returns

`Observable`: of emitted props from the Region component.

### getData$

> getdata$()

#### Returns

`Observable`: of the `data` prop from the Region component.
