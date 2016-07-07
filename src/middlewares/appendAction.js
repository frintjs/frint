export default function (options = {}) {
  const opts = {
    key: null,
    value: null,
    ...options,
  };

  return store => next => action => { // eslint-disable-line
    if (!opts.key) {
      return next(action);
    }

    return next({
      ...action,
      [opts.key]: opts.value
    });
  };
}
