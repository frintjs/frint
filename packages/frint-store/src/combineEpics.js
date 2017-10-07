import { merge as merge$ } from 'rxjs/observable/merge';

export default function combineEpics(...epics) {
  return function rootEpic(...args) {
    const toMerge = epics
      .map(epic => epic(...args));

    return merge$(...toMerge);
  };
}
