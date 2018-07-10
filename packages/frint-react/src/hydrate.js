/* eslint-disable import/no-extraneous-dependencies, global-require */
import React from 'react';

import getMountableComponent from './components/getMountableComponent';

export default function hydrate(app, node) {
  const MountableComponent = getMountableComponent(app);
  const ReactDOM = require('react-dom');

  return ReactDOM.hydrate(<MountableComponent />, node);
}
