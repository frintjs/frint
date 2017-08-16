import { Observable } from 'rxjs';

export default function combineEpics(...epics) {
  return function rootEpic(...args) {
    const toMerge = epics
      .map(epic => epic(...args));

    return Observable.merge(...toMerge);
  };
}
