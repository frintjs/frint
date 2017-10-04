import BaseError from './Base';

export default class TypesError extends BaseError {
  constructor(...args) {
    super(...args);

    this.name = 'TypesError';
  }
}
