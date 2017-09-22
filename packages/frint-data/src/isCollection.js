import BaseCollection from './base/Collection';

export default function isCollection(collection) {
  return collection instanceof BaseCollection;
}
