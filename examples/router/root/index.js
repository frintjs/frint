import { render } from 'frint-react';

import App from './app';
import './styles/index.css';

window.app = new App();

render(
  window.app,
  document.getElementById('root')
);
