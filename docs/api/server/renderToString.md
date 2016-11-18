# renderToString

Renders an App instance to a string.

## Usage

```js
import { renderToString } from 'frint/lib/server';

import MyApp from '../app'; // your App class

const app = new MyApp();

const html = renderToString(app);
```

## Arguments

1. `app`: Instance of your App

## Returns

String of App's rendered HTML output.
