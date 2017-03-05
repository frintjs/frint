import {
  renderToString as reactRenderToString
} from 'react-dom/server';

export default {
  install(Frint) {
    const { h, getMountableComponent } = Frint;

    Frint.renderToString = function renderToString(app) {
      const Component = getMountableComponent(app);

      return reactRenderToString(<Component />);
    };
  }
};
