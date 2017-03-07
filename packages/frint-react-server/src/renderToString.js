/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { renderToString as reactRenderToString } from 'react-dom/server';

import { getMountableComponent } from 'frint-react';

export default function renderToString(app) {
  const Component = getMountableComponent(app);

  return reactRenderToString(<Component />);
}
