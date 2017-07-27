---
title: Routing
sidebarPartial: guidesSidebar
---

# Routing

<!-- MarkdownTOC depth=1 autolink=true bracket=round -->
- [What is routing?](#what-is-routing-)
- [Routing in Frint](#routing-in-frint)
  - [Dependencies](#dependencies)
  - [Creating components](#creating-components)
  - [Creating a router](#creating-a-router)
  - [Creating an app](#creating-an-app)
  - [Wiring things up](#wiring-things-up)
- [Default route](#default-route)
- [Nested routes](#nested-routes)
- [Another example](#another-example)

<!-- /MarkdownTOC -->

## What is routing?

In context of a single page application (SPA) routing is a feature that allows you to show 
different content depending on the URL, but without reloading the page. To the user it looks like
navigating different pages.   

Routing can use either modern HTML5 History API to change URL completely or use hash URLs, storing route
in the URL part after hash mark (#).  

## Routing in Frint

To facilitate routing Frint comes with with two packages: `frint-router` and `frint-router-react`.

`frint-router` provides you with router services responsible for storing URL, notifying of URL 
changes and matching it against different path. The services differ in how and where they store URL,
but provide identical API so you can freely replace them with each other. This package isn't bound 
to any view library.

`frint-router-react` is a React-specific package which complements `frint-router` and makes routing 
really easy if you chose React as your view library by providing some handy components.

### Dependencies

You will need both `frint-router` and `frint-router-react` for this tutorial as well as `frint`, 
`react` and `frint-react`.

```bash
$ npm install --save frint-router frint-router-react frint react frint-react
```

### Creating components

Let's start by creating components. We will have two components for content pages: `HomePage` and
`AboutPage`. We are also going to have `RootComponent` which will serve as 
container for navigation links and content pages.

We will need to import `React` for creating components as well as `Link` and `Route` components
from `frint-router-react`.

```js
import React from 'react';
import { Link, Route } from 'frint-router-react';

const HomePage = () => <div>Home page</div>;
const AboutPage = () => <div>About page</div>;

const RootComponent = () => {
  return (
    <div>
      <div className="links">
        <Link to="/" activeClassName="is-active" exact>[Home]</Link>
        <Link to="/about" activeClassName="is-active">[About]</Link>
      </div>

      <div className="content">
        <Route path="/" component={HomePage} exact />
        <Route path="/about" component={AboutPage} />
      </div>
    </div>
  );
};
```

Let's go over what happens here.

1. `RootComponent` renders section with navigation links using `Link` component. `Link` component 
creates an anchor or a button leading to a certain URL. It also applies CSS class `is-active` 
(passed as `activeClassName` prop) to the link element automatically when current URL matches the 
one passed to the `Link`.
2. It also makes use of `Route` component to switch between content pages. Whenever `path` passed to
`Route` component matches current URL it will render `component` from the `props`. Just as with 
`Link` you can choose whether it should be an exact match. You can also pass a Frint app as an `app`
 prop instead of `component`.

### Creating a router

To create a router you need to import one of the router services from `frint-router` package and 
instantiate it. 

There are three router services available:
- `BrowserRouterService`: uses modern HTML5 History API
- `HashRouterService`: for legacy browsers
- `MemoryRouterService`: useful for tests

For the purpose of this tutorial we will use `BrowserRouterService`: 

```js
import BrowserRouterService from 'frint-router/BrowserRouterService';

const router = new BrowserRouterService();
```

### Creating an app

Now let's create an app that makes use of the `RootComponent` and `router` we've just created. We
pass them as providers to the app. Names of the providers are defined here by convention. 

- `frint-react` requires that app's main component would be a provider named `component`.
- `frint-router-react` relies on `router` provider name for `Link` and `Route` to get and set 
current URL. If you want to use `Link` or `Route` in your child apps you'll need to cascade the 
`router` provider to them by adding `cascade: true`   

```js
import { createApp } from 'frint';

const RouterApp = createApp({
  name: 'RouterApp',
  providers: [
    {
      name: 'component',
      useValue: RootComponent
    },
    {
      name: 'router',
      useValue: router,
      cascade: true,
    },
  ],
});
```

### Wiring things up

We have everything ready to start the app. We will need `frint-react` to render our app into HTML
element (with id `root` in this case).

```js
import { render } from 'frint-react';

window.app = new RouterApp();

render(
  window.app,
  document.getElementById('root')
);
```

Now if you open it in a browser you should see a page with \[Home] and \[About] links and 
'Home page' content. If you click the links content will change accordingly.

## Default route

Another useful feature of `frint-router-react` is default route which allows you to render a 
component or an app when no other route matched. To enable this behaviour add a `Route` without a 
`path` to your group of `Route` components and them wrap them into `Switch`.

```js
...
import { Route, Link, Switch } from 'frint-router-react';
...
const NotFoundPage = () => <div>Not found</div>;
...
const RootComponent = () => {
  return (
    <div>
      ...
      <div className="content">
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/about" component={AboutPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </div>
  );
};

```  

Now whenever you navigate to URL that doesn't match `/` or `/about` you'll see `NotFoundPage`
rendered.

Note: in `Switch` only the first matching `Route` gets rendered.

## Nested routes

It is also possible for child components to define their own subroutes. So for example if you want
`AboutPage` to have subpages you can render `Link` and `Route` to it.

```js
...
const AboutUs = () => <article>Some content about us...</article>;
const AboutThem = () => <article>Some content about them...</article>;

const AboutPage = ({ match }) => {
  return (
    <div>
      <h2>About page</h2>
        {<ul>
          <li><Link to={`${match.url}`}>About</Link></li>
          <li><Link to={`${match.url}/us`}>About us</Link></li>
          <li><Link to={`${match.url}/them`}>About them</Link></li>
        </ul>}
        <Switch>
          <Route path={`${match.url}/us`} component={AboutUs} />
          <Route path={`${match.url}/them`} component={AboutThem} />
        </Switch>
      </div>
    );
  };
...
```

Because `AboutPage` is rendered using `Route` component it receives a `match` object as a prop. This
object contains `url` which let's you define routes relative to the current.  

It is important that the parent `Route` doesn't have `exact` prop so that it would match all the URLs
starting with the `path`.

## Another example

For more information about usage of Frint routing you can take a look at example here: 
https://github.com/Travix-International/frint/tree/master/examples/router 

# TODO
## Route placeholders
## Async loading with code splitting
