import Base from './Base';

export default class Event extends Base {
  constructor({ path = [] }) {
    super();

    this.path = path;
  }
}
