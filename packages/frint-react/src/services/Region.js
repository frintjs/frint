import { BehaviorSubject } from 'rxjs';

export default class RegionService {
  constructor() {
    this.props$ = new BehaviorSubject({});
  }

  emit(props = {}) {
    this.props$.next(props);
  }

  // @TODO: support synchronous versions
  // getName() {}
  // getKey() {}

  getProps$() {
    return this.props$;
  }

  getData$() {
    return this.props$
      .map((props) => {
        return props.data;
      });
  }
}
