export default function isPromise(promise) {
  if (typeof promise !== 'object') {
    return false;
  }

  if (typeof promise.then !== 'function') {
    return false;
  }

  return true;
}
