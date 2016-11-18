import React from 'react';
import {
  renderToString as reactRenderToString
} from 'react-dom/server';

export default function renderToString(app) {
  const Component = app.render();

  return reactRenderToString(<Component />);
}
