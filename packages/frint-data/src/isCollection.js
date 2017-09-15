import BaseCollection from './base/Collection';

export default function isCollection(collection) {
  try {
    return collection instanceof BaseCollection;
  } catch (e) {
    return false;
  }
}
