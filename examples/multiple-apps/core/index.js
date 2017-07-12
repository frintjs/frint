import { render } from 'frint-react';

import App from './app';

const apps = window.app || [];
const app = window.app = new App();
app.push = options => app.registerApp(...options);
apps.forEach(app.push);

render(app, document.getElementById('root'));
