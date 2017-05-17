import { render } from 'frint-react';

import App from './app';

window.app = new App();

render(
  window.app,
  document.getElementById('root')
);
