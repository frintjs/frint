import App from './App';
import createApp from './createApp';
import createCore from './createCore';
import createWidget from './createWidget';

const Frint = {
  App,
  createApp,
  createCore,
  createWidget,
};

Frint.use = function use(Plugin, ...args) {
  if (typeof Plugin.install !== 'function') {
    throw new Error('Plugin does not have any `install` option.');
  }

  return Plugin.install(Frint, ...args);
};

export default Frint;
