/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { Subject } from 'rxjs/Subject';
import { filter as filter$ } from 'rxjs/operators/filter';
import { map as map$ } from 'rxjs/operators/map';

import combineEpics from './combineEpics';
import ActionsObservable from './ActionsObservable';

describe('frint-store › combineEpics', function () {
  it('triggers epics correct response', function () {
    const pingEpic = function (action$) {
      return action$
        .pipe(
          filter$(action => action.type === 'PING'),
          map$(() => ({ type: 'PONG' }))
        );
    };

    const rootEpic = combineEpics(pingEpic);

    const subject$ = new Subject();
    const actions$ = new ActionsObservable(subject$);
    const result$ = rootEpic(actions$);
    const emittedActions = [];

    const subscription = result$.subscribe((emittedAction) => {
      emittedActions.push(emittedAction);
    });
    subject$.next({ type: 'PING' });

    expect(emittedActions).to.deep.equal([
      { type: 'PONG' }
    ]);

    subscription.unsubscribe();
  });
});
