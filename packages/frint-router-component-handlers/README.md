# frint-router-component-handlers

[![npm](https://img.shields.io/npm/v/frint-router-component-handlers.svg)](https://www.npmjs.com/package/frint-router-component-handlers)

> Router component handlers package of Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
- [API](#api)
  - [createLinkHandler](#createlinkhandler)
  - [createRouteHandler](#createroutehandler)
  - [createSwitchHandler](#createswitchhandler)

<!-- /MarkdownTOC -->

---

# Guide

This package is aimed at enabling other reactive rendering/templating libraries integrate with FrintJS router, and not to be used directly by developers in their applications.

For example, take a look at `frint-router-react` for its implementation using this package internally.

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-router-component-handlers
```

# API


## createLinkHandler

> createLinkHandler(ComponentHandler, app, component)

Method for creating handler for `Link` component.

#### Arguments

1. `ComponentHandler` (`Object`): framework specific component handler implementing common API to work with `component` 
2. `app` (`Object`): app instance
3. `component` (`Object`): `Link` component instance


## createRouteHandler

> createRouteHandler(ComponentHandler, app, component)

Method for creating handler for `Route` component.

#### Arguments

1. `ComponentHandler` (`Object`): framework specific component handler implementing common API to work with `component` 
2. `app` (`Object`): app instance
3. `component` (`Object`): `Route` component instance


## createSwitchHandler

> createSwitchHandler(ComponentHandler, app, component)

Method for creating handler for `Switch` component.

#### Arguments

1. `ComponentHandler` (`Object`): framework specific component handler implementing common API to work with `component` 
2. `app` (`Object`): app instance
3. `component` (`Object`): `Switch` component instance
