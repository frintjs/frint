const Frint = {};

Frint.use = function use(Plugin, ...args) {
  if (typeof Plugin.install !== 'function') {
    throw new Error('Plugin does not have any `install` option.');
  }

  return Plugin.install(Frint, ...args);
};

export default Frint;
