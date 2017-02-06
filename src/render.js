import ReactDOM from 'react-dom';

import h from './h';
import getMountableComponent from './components/getMountableComponent';

export default function render(app, node) {
  const MountableComponent = getMountableComponent(app);

  return ReactDOM.render(<MountableComponent />, node);
}
