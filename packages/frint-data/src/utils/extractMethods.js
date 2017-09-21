export default function extractMethods(options, exclude = []) {
  return Object.keys(options)
    .filter(k => exclude.indexOf(k) === -1)
    .filter(k => typeof options[k] === 'function')
    .reduce(function reducer(acc, k) {
      acc[k] = options[k];

      return acc;
    }, {});
}
