import BaseError from './Base';

export default class MethodError extends BaseError {
  constructor(...args) {
    super(...args);

    this.name = 'MethodError';
  }
}
