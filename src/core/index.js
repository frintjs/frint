import App from './App';
import createApp from './createApp';
import createCore from './createCore';
import createWidget from './createWidget';

const Plugin = {
  App,
  createApp,
  createCore,
  createWidget,
};

Plugin.install = function install(Frint) {
  Frint.App = App;
  Frint.createCore = createCore;
  Frint.createWidget = createWidget;
};

export default Plugin;
