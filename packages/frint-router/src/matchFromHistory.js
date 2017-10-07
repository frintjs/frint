import tail from 'lodash/tail';
import zipObject from 'lodash/zipObject';
import pathToRegexp from 'path-to-regexp';

export default function matchFromHistory(pattern, history, options = {}) {
  if (!pattern) {
    return {
      url: history.location.pathname,
      isExact: false,
      params: {},
    };
  }

  const keys = [];
  const re = pathToRegexp(pattern, keys, {
    end: options.exact || false,
  });

  const matched = re.exec(history.location.pathname);

  if (!Array.isArray(matched)) {
    return null;
  }

  const url = matched[0];
  const restValues = tail(matched);
  const keyNames = keys.map(k => k.name);
  const isExact = (url === history.location.pathname);

  if (options.exact && !isExact) {
    return null;
  }

  const params = zipObject(keyNames, restValues);

  return {
    url,
    isExact,
    params,
  };
}
