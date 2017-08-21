/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import createStore from './createStore';
import combineReducers from './combineReducers';
import combineEpics from './combineEpics';

describe('frint-store › combineEpics', function () {
  // constants
  const PING = 'PING';
  const PONG = 'PONG';
  const APPLE = 'APPLE';
  const ORANGE = 'ORANGE';

  const INITIAL_STATE = {
    isPinging: false,
    isFruit: ORANGE
  };

  // reducers
  function pingReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case PING:
        return {
          isPinging: true,
        };

      case PONG:
        return {
          isPinging: false,
        };

      default:
        return state;
    }
  }

  function fruitReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case APPLE:
        return {
          isFruit: APPLE,
        };

      case ORANGE:
        return {
          isFruit: ORANGE,
        };

      default:
        return state;
    }
  }

  const rootReducer = combineReducers({
    ping: pingReducer,
    fruit: fruitReducer
  });

  // epics
  function pingEpic$(action$) {
    return action$
      .filter(action => action.type === PING)
      .delay(10)
      .map(() => ({ type: PONG }));
  }

  function fruitEpic$(action$) {
    return action$
      .filter(action => action.type === APPLE)
      .delay(10)
      .map(() => ({ type: ORANGE }));
  }

  const rootEpic$ = combineEpics(pingEpic$, fruitEpic$);
  // Store
  const Store = createStore({
    enableLogger: false,
    reducer: rootReducer,
    epic: rootEpic$,
  });
  const store = new Store();

  it('return correct values from first combined epic', function (done) {
    expect(store.getState().ping.isPinging).to.equal(false);

    store.getState$()
      .take(3)
      .scan(
        function (acc, curr) {
          acc.push({ isPinging: curr.ping.isPinging });

          return acc;
        },
        []
      )
      .last()
      .subscribe(function (pingStates) {
        expect(pingStates).to.deep.equal([
          { isPinging: false }, // initial state
          { isPinging: true }, // after PING
          { isPinging: false }, // after PING has dispatched PONG
        ]);

        done();
      });

    store.dispatch({ type: PING });
  });

  it('return correct values from second combined epic', function (done) {
    expect(store.getState().fruit.isFruit).to.equal(ORANGE);

    store.getState$()
    .take(3)
    .scan(
      function (acc, curr) {
        acc.push({ isFruit: curr.fruit.isFruit });

        return acc;
      },
      []
    )
    .last()
    .subscribe(function (fruitStates) {
      expect(fruitStates).to.deep.equal([
        { isFruit: ORANGE },
        { isFruit: APPLE },
        { isFruit: ORANGE },
      ]);

      done();
    });

    store.dispatch({ type: APPLE });
  });
});
