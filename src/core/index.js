import App from './App';
import createApp from './createApp';
import isObservable from './isObservable';

const Frint = {
  App,
  createApp,
  isObservable,
};

Frint.use = function use(Plugin) {
  if (typeof Plugin.install !== 'function') {
    throw new Error('Plugin does not have any `install` option.');
  }

  return Plugin.install(Frint);
};

export default Frint;
