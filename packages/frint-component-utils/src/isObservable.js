export default function isObservable(obj) {
  if (
    obj &&
    typeof obj.subscribe === 'function'
  ) {
    return true;
  }

  return false;
}
