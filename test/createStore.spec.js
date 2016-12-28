/* global describe, it */
import { expect } from 'chai';

import {
  createStore,
  combineReducers,
} from '../src';

describe('createStore', function () {
  it('returns function', function () {
    const Store = createStore();
    expect(Store).to.be.a('function');
  });

  it('returns initial state upon subscription', function (done) {
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

        done();
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

  it('dispatches async actions, with thunk argument', function () {
    const actions = [];
    const Store = createStore({
      enableLogger: false,
      thunkArgument: { foo: 'bar' },
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
    store.dispatch(function (dispatch, getState, thunkArg) {
      dispatch({
        type: 'INCREMENT_COUNTER',
        thunkArg
      });
    });
    store.dispatch({ type: 'DECREMENT_COUNTER' });

    expect(actions).to.deep.equal([
      { type: '__FRINT_INIT__' },
      { type: 'INCREMENT_COUNTER' },
      { type: 'INCREMENT_COUNTER', thunkArg: { foo: 'bar' } },
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

  it('subscribes with callback function', function () {
    const Store = createStore({
      enableLogger: false,
      thunkArgument: { foo: 'bar' },
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
    const unsubscribe = store.subscribe(function (state) {
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

    unsubscribe();

    store.dispatch({ type: 'INCREMENT_COUNTER' });
    expect(states.length).to.equal(4); // no more triggers
  });

  it('destroys internal subscription', function () {
    const Store = createStore({
      enableLogger: false,
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

  it('handles combined reducers', function () {
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
      { counter: { value: 100 }, color: { value: 'red' } },  // initial
      { counter: { value: 101 }, color: { value: 'red' } },  // INCREMENT_COUNTER
      { counter: { value: 102 }, color: { value: 'red' } },  // INCREMENT_COUNTER
      { counter: { value: 101 }, color: { value: 'red' } },  // DECREMENT_COUNTER
      { counter: { value: 101 }, color: { value: 'green' } } // SET_COLOR
    ]);

    subscription.unsubscribe();
  });
});
