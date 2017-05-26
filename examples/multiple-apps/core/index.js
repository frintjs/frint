import { render } from 'frint-react';

import App from './app';

const apps = window.app || [];
window.app = new App();

window.app.push = function ([app, options]) {
  window.app.registerApp(app, options);
};

apps.forEach(window.app.push);

render(
  window.app,
  document.getElementById('root')
);
