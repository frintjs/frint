import {
  renderToString as reactRenderToString
} from 'react-dom/server';

export default {
  install(Frint) {
    const { h } = Frint;

    Frint.renderToString = function renderToString(app) {
      const Component = app.getComponent();

      return reactRenderToString(<Component />);
    };
  }
};
