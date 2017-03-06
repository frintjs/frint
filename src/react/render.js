import ReactDOM from 'react-dom';

import h from './h';
import ReactPlugin from './';

export default function render(app, node) {
  const MountableComponent = ReactPlugin.getMountableComponent(app);

  return ReactDOM.render(<MountableComponent />, node);
}
