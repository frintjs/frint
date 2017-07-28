# frint-router-react

[![npm](https://img.shields.io/npm/v/frint-router-react.svg)](https://www.npmjs.com/package/frint-router-react)

> Router package for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Nested routes](#nested-routes)
  - [Note](#note)
- [API](#api)
  - [Route](#route)
  - [Link](#link)
  - [Switch](#switch)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-router frint-router-react
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://unpkg.com/frint-router-react@latest/dist/frint-router-react.min.js"></script>

<script>
  // available as `window.FrintRouterReact`
</script>
```

## Usage

This package exports a handful of components.

### `Route` component

The `Route` component is how you define a route in your application, that can render either a Component or an App.

#### Components

Assume you have two components `HomePage` and `AboutPage`, and you want to show them when the browser navigates to `/` and `/about` respectively:

```js
// components/Root.js
import { Route } from 'frint-router-react';

import HomePage from './HomePage';
import AboutPage from './AboutPage';

export default function Root() {
  return (
    <div>
      <Route path="/" component={HomePage} exact />
      <Route path="/about" component={AboutPage} />
    </div>
  );
}
```

The `exact` prop means, the route will be matched to the exact string `/`. Any further suffix in the URL would result in a no match.

#### Apps

Similar to Components, Apps can also be mounted for specific routes:

```js
// components/Root.js
import React from 'react';
import { Route } from 'frint-router-react';

import HomePage from './HomePage';
import ContactPageApp from '../contactPageApp';

export default function Root() {
  return (
    <div>
      <Route path="/about" app={ContactPage} />
    </div>
  );
}
```

### `Switch` component

The `Switch` component makes sure only one direct child `Route` is shown. The first one to match always wins, and the last `Route` with no `path` is rendered as a default case.

Take a look at this scenario, for e.g.:

```js
// components/MyComponent.js
import React from 'react';
import { Switch, Route } from 'frint-router-react';

import Foo from './Foo';
import Bar from './Bar';
import Baz from './Baz';

function NoMatch() {
  return (
    <p>Nothing to show.</p>
  );
}

export default MyComponent() {
  return (
    <div>
      <Switch>
        <Route path="/foo" component={Foo} />
        <Route path="/bar" component={Bar} />
        <Route path="/baz" component={Baz} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
}
```

If the URL happens to be `/foo`, then `Foo` component will render. Same follows for `Bar` and `Baz` if URLs are `/bar` and `/baz` respectively.

And only one of them can render at the same time. If there is no match, the last `Route` with no `path` defined will be rendered. Much like handling the `default` use case in a plain `switch` statement in JavaScript.

### `Link` component

The `Link` component is used for creating links, that can navigate to other pages. It will take care of adapting to the router service that you are using from `frint-router` automatically.

```js
// components/TopNav.js
import React from 'react';
import { Link } from 'frint-router-react';

export default function TopNav() {
  return (
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  );
}
```

You can also pass additional props to render the links with CSS class names when they are active for example:

```js
export default function TopNav() {
  return (
    <ul>
      <li>
        <Link
          to="/"
          className="nav-link"
          activeClassName="is-active"
          exact
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/about"
          className="nav-link"
          activeClassName="is-active"
        >
          About
        </Link>
      </li>
    </ul>
  );
}
```

## Nested routes

When `Route` renders a particular Component, the component is given a `match` prop which contains information about the currently matched path.

If you had a route for `/about` like this:

```js
// components/Root.js
import React from 'react';
import { Route } from 'frint-router-react';

import HomePage from './HomePage';
import AboutPage from './AboutPage';

export default function Root() {
  return (
    <div>
      <Route path="/" component={HomePage} exact />
      <Route path="/about" component={AboutPage} />
    </div>
  );
}
```

And when you navigate to `/about` in the browser, the `AboutPage` component will have access to a `match` prop:

```js
// components/AboutPage.js
import React from 'react';

export default function AboutPage(props) {
  return (
    <div>
      <h2>About Page</h2>

      <p>The current matched URL is {props.match.url}</p>
    </div>
  );
}
```

The page will render with the text `The current matched URL is /about`.

Now that you know in which path the component rendered itself in, you can have further child routes in the Component:

```js
// components/AboutPage.js
import React from 'react';
import { Route, Switch } from 'frint-router-react';

function NoMatch() {
  return (
    <p>No user has been selected.</p>
  );
}

function ShowUser(props) {
  const { match } = props;

  return (
    <p>Current selected user is {match.params.user}</p>
  );
}

export default function AboutPage(props) {
  const { match } = props;

  return (
    <div>
      <h2>About Page</h2>

      <ul>
        <li><Link to={`${match.url}/harry`}>Harry</Link></li>
        <li><Link to={`${match.url}/hermione`}>Hermione</Link></li>
        <li><Link to={`${match.url}/ron`}>Ron</Link></li>
      </ul>

      <Switch>
        <Route path={`${match.url}/:user`} component={ShowUser} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
}
```

### `match` prop

The `props.match` object in Components follow a structure like this:

```js
// in AboutPage component
{
  url: '/about',
  isExact: true,
  params: {}
}

// in ShowUser component
{
  url: '/about/hermione',
  isExact: true,
  params: {
    user: 'hermione',
  }
}
```

Since `props.match` always contains the currenly matched URL info for the rendered Component, it is possible for you to create more child Routes dynamically.

## Note

This package is a close implementation of the APIs introduced by the awesome [`react-router`](https://github.com/ReactTraining/react-router), but done in a way to fit well with rest of the FrintJS packages.

---

# API

## Route

> Route

### Props

1. `path` (`String`): The pattern to match against
  * Example (plain): `/about`
  * Example (with params): `/about/:user`
1. `exact` (`Boolean`): Match the `path` exactly (with no suffix in the path)
1. `component` (`Component`): The React component to render
1. `app` (`App`): Frint App that you want to render

## Link

> Link

### Props

1. `to` (`String`): Path to navigate to
1. `type` (`String`): If you want the Link to render as a `<button>` with its type, otherwise defaults to plain anchors (`<a>`)
1. `className` (`String`): CSS class name
1. `activeClassName` (`String`): CSS class name to render with, if current URL matches the Link's
1. `exact` (`Boolean`): Trigger `activeClassName` by matching the path exactly
1. `children` (`Node`): The body of the Link

## Switch

> Switch

### Props

1. `children` (`Node`): Children of `<Route>`s
