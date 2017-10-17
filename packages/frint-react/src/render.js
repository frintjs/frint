/* eslint-disable import/no-extraneous-dependencies, global-require */
import React from 'react';

import getMountableComponent from './components/getMountableComponent';

export default function render(app, node) {
  const MountableComponent = getMountableComponent(app);
  const ReactDOM = require('react-dom');

  return ReactDOM.render(<MountableComponent />, node);
}
