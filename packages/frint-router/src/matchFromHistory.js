import _ from 'lodash';
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
    end: options.exact ? true : false,
  });

  const matched = re.exec(history.location.pathname);

  if (!matched) {
    return null;
  }

  const url = matched[0];
  const restValues = _.tail(matched);
  const keyNames = keys.map(k => k.name);
  const isExact = (url === history.location.pathname);

  if (options.exact && !isExact) {
    return null;
  }

  const params = _.zipObject(keyNames, restValues);

  return {
    url,
    isExact,
    params,
  };
}
