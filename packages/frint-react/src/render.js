import React from 'react';
import ReactDOM from 'react-dom';

import FrintReact from './';

export default function render(app, node) {
  const MountableComponent = FrintReact.getMountableComponent(app);

  return ReactDOM.render(<MountableComponent />, node);
}
