/**
 * Check if given `obj` is an Observable or not.
 *
 * @param any obj
 * @return boolean
 */
export default function isObservable(obj) {
  if (obj && typeof obj.subscribe === 'function') {
    return true;
  }

  return false;
}
