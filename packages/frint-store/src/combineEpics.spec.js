/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { Subject } from 'rxjs/Subject';
import { filter as filter$ } from 'rxjs/operator/filter';
import { map as map$ } from 'rxjs/operator/map';

import combineEpics from './combineEpics';
import ActionsObservable from './ActionsObservable';

describe('frint-store › combineEpics', function () {
  it('triggers epics correct response', function (done) {
    const pingEpic = function (action$) {
      return action$
        ::filter$(action => action.type === 'PING')
        ::map$(() => ({ type: 'PONG' }));
    };

    const rootEpic = combineEpics(pingEpic);

    const subject$ = new Subject();
    const actions$ = new ActionsObservable(subject$);
    const result$ = rootEpic(actions$);
    const emittedActions = [];

    result$.subscribe((emittedAction) => {
      emittedActions.push(emittedAction);
    }).then(done());

    subject$.next({ type: 'PING' });

    expect(emittedActions).to.deep.equal([
      { type: 'PONG' }
    ]);
  });
});
