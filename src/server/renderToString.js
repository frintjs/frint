import {
  renderToString as reactRenderToString
} from 'react-dom/server';

import { h } from '../';

export default function renderToString(app) {
  const Component = app.getComponent();

  return reactRenderToString(<Component />);
}
