import {
  renderToString as reactRenderToString
} from 'react-dom/server';

import h from '../h';

export default function renderToString(app) {
  const Component = app.getComponent();

  return reactRenderToString(<Component />);
}
