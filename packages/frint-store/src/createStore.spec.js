/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { filter as filter$ } from 'rxjs/operators/filter';
import { delay as delay$ } from 'rxjs/operators/delay';
import { map as map$ } from 'rxjs/operators/map';
import { take as take$ } from 'rxjs/operators/take';
import { last as last$ } from 'rxjs/operators/last';
import { scan as scan$ } from 'rxjs/operators/scan';

import createStore from './createStore';
import combineReducers from './combineReducers';
import combineEpics from './combineEpics';

describe('frint-store › createStore', function () {
  it('returns function', function () {
    const Store = createStore();
    expect(Store).to.be.a('function');
  });

  it('returns initial state upon subscription', function () {
    const Store = createStore();
    const store = new Store({
      enableLogger: false,
      initialState: {
        ok: true,
      }
    });

    const subscription = store.getState$()
      .subscribe(function (state) {
        expect(state).to.deep.equal({
          ok: true,
        });
      });

    subscription.unsubscribe();
  });

  it('dispatches actions, that update state', function () {
    const Store = createStore({
      enableLogger: false,
      initialState: {
        counter: 0,
      },
      reducer: function (state, action) {
        switch (action.type) {
          case 'INCREMENT_COUNTER':
            return Object.assign({}, {
              counter: state.counter + 1
            });
          case 'DECREMENT_COUNTER':
            return Object.assign({}, {
              counter: state.counter - 1
            });
          default:
            return state;
        }
      }
    });
    const store = new Store();

    const states = [];
    const subscription = store.getState$()
      .subscribe(function (state) {
        states.push(state);
      });

    store.dispatch({ type: 'INCREMENT_COUNTER' });
    store.dispatch({ type: 'INCREMENT_COUNTER' });
    store.dispatch({ type: 'DECREMENT_COUNTER' });

    expect(states.length).to.equal(4); // 1 initial + 3 dispatches

    const lastState = states[states.length - 1];
    expect(lastState).to.deep.equal({
      counter: 1
    });

    const synchronousState = store.getState();
    expect(synchronousState).to.deep.equal({
      counter: 1
    });

    subscription.unsubscribe();
  });

  it('appends to action payload', function () {
    const actions = [];
    const Store = createStore({
      enableLogger: false,
      appendAction: {
        appName: 'Blah',
      },
      initialState: {
        counter: 0,
      },
      reducer: function (state, action) {
        actions.push(action);

        return state;
      }
    });

    const store = new Store();

    const states = [];
    const subscription = store.getState$()
      .subscribe(function (state) {
        states.push(state);
      });

    store.dispatch({ type: 'INCREMENT_COUNTER' });

    expect(actions).to.deep.equal([
      { appName: 'Blah', type: '__FRINT_INIT__' },
      { appName: 'Blah', type: 'INCREMENT_COUNTER' },
    ]);

    subscription.unsubscribe();
  });

  it('dispatches async actions, with deps argument', function () {
    const actions = [];
    const Store = createStore({
      enableLogger: false,
      deps: { foo: 'bar' },
      initialState: {
        counter: 0,
      },
      reducer: function (state, action) {
        actions.push(action);

        switch (action.type) {
          case 'INCREMENT_COUNTER':
            return Object.assign({}, {
              counter: state.counter + 1
            });
          case 'DECREMENT_COUNTER':
            return Object.assign({}, {
              counter: state.counter - 1
            });
          default:
            return state;
        }
      }
    });
    const store = new Store();

    const states = [];
    const subscription = store.getState$()
      .subscribe(function (state) {
        states.push(state);
      });

    store.dispatch({ type: 'INCREMENT_COUNTER' });
    store.dispatch(function (dispatch, getState, deps) {
      dispatch({
        type: 'INCREMENT_COUNTER',
        deps
      });
    });
    store.dispatch({ type: 'DECREMENT_COUNTER' });

    expect(actions).to.deep.equal([
      { type: '__FRINT_INIT__' },
      { type: 'INCREMENT_COUNTER' },
      { type: 'INCREMENT_COUNTER', deps: { foo: 'bar' } },
      { type: 'DECREMENT_COUNTER' },
    ]);

    expect(states.length).to.equal(4);
    expect(states).to.deep.equal([
      { counter: 0 },
      { counter: 1 },
      { counter: 2 },
      { counter: 1 },
    ]);

    subscription.unsubscribe();
  });

  it('destroys internal subscription', function () {
    const Store = createStore({
      enableLogger: false,
      epic: function (action$) {
        return action$
          .pipe(filter$(action => action.type === 'PING'));
      },
      initialState: {
        counter: 0
      }
    });
    const store = new Store();

    let changesCount = 0;
    const subscription = store.getState$()
      .subscribe(function () {
        changesCount += 1;
      });

    store.dispatch({ type: 'DO_SOMETHING' });
    expect(changesCount).to.equal(2); // 1 initial + 1 dispatch

    store.destroy();

    store.dispatch({ type: 'DO_SOMETHING_IGNORED' });
    expect(changesCount).to.equal(2); // will stop at 2

    subscription.unsubscribe();
  });

  it('logs state changes', function () {
    const consoleCalls = [];
    const fakeConsole = {
      group() { },
      groupEnd() { },
      log(...args) {
        consoleCalls.push({ method: 'log', args });
      },
    };

    const Store = createStore({
      enableLogger: true,
      console: fakeConsole,
      initialState: {
        counter: 0,
      },
      reducer: function (state, action) {
        switch (action.type) {
          case 'INCREMENT_COUNTER':
            return Object.assign({}, {
              counter: state.counter + 1
            });
          case 'DECREMENT_COUNTER':
            return Object.assign({}, {
              counter: state.counter - 1
            });
          default:
            return state;
        }
      }
    });
    const store = new Store();

    const states = [];
    const subscription = store.getState$()
      .subscribe(function (state) {
        states.push(state);
      });

    store.dispatch({ type: 'INCREMENT_COUNTER' });
    store.dispatch({ type: 'INCREMENT_COUNTER' });
    store.dispatch({ type: 'DECREMENT_COUNTER' });

    expect(states.length).to.equal(4); // 1 initial + 3 dispatches
    expect(states).to.deep.equal([
      { counter: 0 },
      { counter: 1 },
      { counter: 2 },
      { counter: 1 },
    ]);

    expect(consoleCalls.length).to.equal(12); // (1 init + 3 actions) * 3 logs (prev + action + current)
    expect(consoleCalls[3].args[2]).to.deep.equal({ counter: 0 }); // prev
    expect(consoleCalls[4].args[2]).to.deep.equal({ type: 'INCREMENT_COUNTER' }); // action
    expect(consoleCalls[5].args[2]).to.deep.equal({ counter: 1 }); // action

    subscription.unsubscribe();
  });

  it('logs errors from reducers', function () {
    const consoleCalls = [];
    const fakeConsole = {
      group() { },
      groupEnd() { },
      log(...args) {
        consoleCalls.push({ method: 'log', args });
      },
      error(...args) {
        consoleCalls.push({ method: 'error', args });
      }
    };

    const Store = createStore({
      enableLogger: true,
      console: fakeConsole,
      initialState: {
        counter: 0,
      },
      reducer: function (state, action) {
        switch (action.type) {
          case 'DO_SOMETHING':
            throw new Error('Something went wrong...');
          default:
            return state;
        }
      }
    });
    const store = new Store();

    const subscription = store.getState$()
      .subscribe(() => {});

    store.dispatch({ type: 'DO_SOMETHING' });

    expect(consoleCalls.length).to.equal(5); // 3 init + 2 errors

    expect(consoleCalls[3].method).to.equal('error');
    expect(consoleCalls[3].args[0]).to.exist
      .and.to.contain('Error processing @')
      .and.to.contain('DO_SOMETHING');

    expect(consoleCalls[4].method).to.equal('error');
    expect(consoleCalls[4].args[0]).to.exist
      .and.be.instanceof(Error)
      .and.have.property('message', 'Something went wrong...');

    subscription.unsubscribe();
  });

  describe('handles combined reducers', function () {
    function counterReducer(state = { value: 0 }, action) {
      switch (action.type) {
        case 'INCREMENT_COUNTER':
          return Object.assign({}, {
            value: state.value + 1
          });
        case 'DECREMENT_COUNTER':
          return Object.assign({}, {
            value: state.value - 1
          });
        default:
          return state;
      }
    }

    function colorReducer(state = { value: 'blue' }, action) {
      switch (action.type) {
        case 'SET_COLOR':
          return Object.assign({}, {
            value: action.color
          });
        default:
          return state;
      }
    }

    const rootReducer = combineReducers({
      counter: counterReducer,
      color: colorReducer,
    });

    it('with given initial state', function () {
      const Store = createStore({
        enableLogger: false,
        initialState: {
          counter: {
            value: 100,
          },
          color: {
            value: 'red'
          }
        },
        reducer: rootReducer,
      });
      const store = new Store();

      const states = [];
      const subscription = store.getState$()
        .subscribe((state) => {
          states.push(state);
        });

      store.dispatch({ type: 'INCREMENT_COUNTER' });
      store.dispatch({ type: 'INCREMENT_COUNTER' });
      store.dispatch({ type: 'DECREMENT_COUNTER' });
      store.dispatch({ type: 'SET_COLOR', color: 'green' });

      expect(states).to.deep.equal([
        { counter: { value: 100 }, color: { value: 'red' } }, // initial
        { counter: { value: 101 }, color: { value: 'red' } }, // INCREMENT_COUNTER
        { counter: { value: 102 }, color: { value: 'red' } }, // INCREMENT_COUNTER
        { counter: { value: 101 }, color: { value: 'red' } }, // DECREMENT_COUNTER
        { counter: { value: 101 }, color: { value: 'green' } } // SET_COLOR
      ]);

      subscription.unsubscribe();
    });

    it('with no given initial state', function () {
      const Store = createStore({
        enableLogger: false,
        reducer: rootReducer,
      });
      const store = new Store();

      const states = [];
      const subscription = store.getState$()
        .subscribe((state) => {
          states.push(state);
        });

      store.dispatch({ type: 'INCREMENT_COUNTER' });
      store.dispatch({ type: 'INCREMENT_COUNTER' });
      store.dispatch({ type: 'DECREMENT_COUNTER' });
      store.dispatch({ type: 'SET_COLOR', color: 'green' });

      expect(states).to.deep.equal([
        { counter: { value: 0 }, color: { value: 'blue' } }, // initial
        { counter: { value: 1 }, color: { value: 'blue' } }, // INCREMENT_COUNTER
        { counter: { value: 2 }, color: { value: 'blue' } }, // INCREMENT_COUNTER
        { counter: { value: 1 }, color: { value: 'blue' } }, // DECREMENT_COUNTER
        { counter: { value: 1 }, color: { value: 'green' } } // SET_COLOR
      ]);

      subscription.unsubscribe();
    });

    it('with partially given initial state for certain reducers', function () {
      const Store = createStore({
        enableLogger: false,
        initialState: {
          counter: {
            value: 100,
          },
        },
        reducer: rootReducer,
      });
      const store = new Store();

      const states = [];
      const subscription = store.getState$()
        .subscribe((state) => {
          states.push(state);
        });

      store.dispatch({ type: 'INCREMENT_COUNTER' });
      store.dispatch({ type: 'INCREMENT_COUNTER' });
      store.dispatch({ type: 'DECREMENT_COUNTER' });
      store.dispatch({ type: 'SET_COLOR', color: 'green' });

      expect(states).to.deep.equal([
        { counter: { value: 100 }, color: { value: 'blue' } }, // initial
        { counter: { value: 101 }, color: { value: 'blue' } }, // INCREMENT_COUNTER
        { counter: { value: 102 }, color: { value: 'blue' } }, // INCREMENT_COUNTER
        { counter: { value: 101 }, color: { value: 'blue' } }, // DECREMENT_COUNTER
        { counter: { value: 101 }, color: { value: 'green' } } // SET_COLOR
      ]);

      subscription.unsubscribe();
    });
  });

  it('creates Store with epics', function (done) {
    // constants
    const PING = 'PING';
    const PONG = 'PONG';

    const INITIAL_STATE = {
      isPinging: false,
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

    const rootReducer = combineReducers({
      ping: pingReducer,
    });

    // epics
    function pingEpic$(action$) {
      return action$
        .pipe(
          filter$(action => action.type === PING),
          delay$(10),
          map$(() => ({ type: PONG }))
        );
    }

    const rootEpic$ = combineEpics(pingEpic$);

    // Store
    const Store = createStore({
      enableLogger: false,
      reducer: rootReducer,
      epic: rootEpic$,
    });

    const store = new Store();

    expect(store.getState().ping.isPinging).to.equal(false);

    store.getState$()
      .pipe(
        take$(3),
        scan$(
          function (acc, curr) {
            acc.push({ isPinging: curr.ping.isPinging });

            return acc;
          },
          []
        ),
        last$()
      )
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
});
