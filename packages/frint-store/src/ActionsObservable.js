import { Observable } from 'rxjs';

class ActionsObservable extends Observable {
  constructor(source) {
    super();
    this.source = source;
  }
}

export default ActionsObservable;
