import React from 'react';
import ReactDOM from 'react-dom';

import h from './h';
import getMountableComponent from './getMountableComponent';

export default function render(app, node) {
  const MountableComponent = getMountableComponent(app);

  return ReactDOM.render(<MountableComponent />, node);
}
