/* global describe, it */
import { expect } from 'chai';

import {
  createStore,
} from '../src';

describe('createStore', function () {
  it('returns function', function () {
    const Store = createStore();
    expect(Store).to.be.a('function');
  });

  it('returns initial state upon subscription', function (done) {
    const Store = createStore();
    const store = new Store({
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

    expect(states.length).to.equal(2); // 1 initial + 1 dispatch
    expect(actions[0]).to.deep.equal({
      appName: 'Blah',
      type: 'INCREMENT_COUNTER',
    });

    subscription.unsubscribe();
  });

  it('dispatches async actions, with thunk argument', function () {
    const actions = [];
    const Store = createStore({
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
      return {
        type: 'INCREMENT_COUNTER',
        thunkArg
      };
    });
    store.dispatch({ type: 'DECREMENT_COUNTER' });

    expect(actions.length).to.equal(3);
    expect(actions).to.deep.equal([
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
});
