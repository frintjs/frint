// @TODO: this should be renamed to some other Error
import BaseError from './Base';

export default class TypeError extends BaseError {
  constructor(...args) {
    super(...args);

    this.name = 'TypeError';
  }
}
