# frint-router-react

[![npm](https://img.shields.io/npm/v/frint-router-react.svg)](https://www.npmjs.com/package/frint-router-react)

> Router package for Frint

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Note](#note)
- [API](#api)

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

### `Route`

The `Route` component is how you define a route in your application, that can render eithr a Component or an App in a synchronous or asynchronous way.

#### Components

Assume you have two components `HomePage` and `AboutPage, and you want to show them when the browser navigates to `/` and `/about` respectively:

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

To load components asynchronously:

```js
export default function Root() {
  return (
    <div>
      <Route path="/about" getComponent={cb => cb(null, AboutPage)} />
    </div>
  );
}
```

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

To load the app asynchronously:

```js
export default function Root() {
  return (
    <div>
      <Route path="/about" getApp={cb => cb(null, ContactPage)} />
    </div>
  );
}
```

### `Switch`

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

### `Link`

The `Link` component is used for creating links, that can navigate to other pages. It will take care of adapting to the router service that you are using from `frint-react` automatically.

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

## Note

This package is a close implementation of the APIs introduced by the awesome [`react-router`](https://github.com/ReactTraining/react-router), but done in a way to fit well with rest of the FrintJS packages.

---

# API
