export default function extractMethods(options, exclude = []) {
  return Object.keys(options)
    .reduce(function reducer(acc, k) {
      if (exclude.indexOf(k) !== -1) {
        return acc;
      }

      if (typeof options[k] !== 'function') {
        return acc;
      }

      acc[k] = options[k];

      return acc;
    }, {});
}
