import { Observable } from 'rxjs/Observable';

class ActionsObservable extends Observable {
  constructor(source) {
    super();
    this.source = source;
  }
}

export default ActionsObservable;
