import BaseError from './Base';

export default class CollectionError extends BaseError {
  constructor(...args) {
    super(...args);

    this.name = 'CollectionError';
  }
}
