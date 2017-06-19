/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import combineReducers from './combineReducers';

describe('frint-store › combineReducers', function () {
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

  function buggyReducer(state = {}, action) {
    switch (action.type) {
      case 'DO_ERROR':
        throw new Error('I am an Error from buggy');
      case 'DO_UNDEFINED':
        return undefined;
      default:
        return state;
    }
  }

  it('combines multiple reducers', function () {
    const rootReducer = combineReducers({
      counter: counterReducer,
      color: colorReducer
    });

    const initialState = {
      counter: { value: 100 },
      color: { value: 'red' }
    };

    const states = [];
    states.push(rootReducer(initialState, { type: 'DO_NOTHING' }));

    states.push(rootReducer(states[states.length - 1], { type: 'INCREMENT_COUNTER' }));
    states.push(rootReducer(states[states.length - 1], { type: 'INCREMENT_COUNTER' }));
    states.push(rootReducer(states[states.length - 1], { type: 'DECREMENT_COUNTER' }));
    states.push(rootReducer(states[states.length - 1], { type: 'SET_COLOR', color: 'blue' }));

    expect(states).to.deep.equal([
      { counter: { value: 100 }, color: { value: 'red' } },
      { counter: { value: 101 }, color: { value: 'red' } },
      { counter: { value: 102 }, color: { value: 'red' } },
      { counter: { value: 101 }, color: { value: 'red' } },
      { counter: { value: 101 }, color: { value: 'blue' } }
    ]);
  });

  it('combines multiple reducers with no given initial state', function () {
    const rootReducer = combineReducers({
      counter: counterReducer,
      color: colorReducer
    });
    const state = rootReducer(undefined, { type: 'DO_NOTHING' });

    expect(state).to.deep.equal({
      counter: {
        value: 0,
      },
      color: {
        value: 'blue',
      },
    });
  });

  it('throws error with reducer key name, when individual reducer errors', function () {
    const consoleCalls = [];
    const fakeConsole = {
      error(...args) {
        consoleCalls.push({
          method: 'error',
          args
        });
      }
    };

    const rootReducer = combineReducers({
      counter: counterReducer,
      color: colorReducer,
      buggy: buggyReducer,
    }, {
      console: fakeConsole
    });

    const initialState = {
      counter: { value: 100 },
      color: { value: 'red' }
    };

    const states = [];
    states.push(rootReducer(initialState, { type: '__INITIAL__' }));

    states.push(rootReducer(states[states.length - 1], { type: 'INCREMENT_COUNTER' }));
    states.push(rootReducer(states[states.length - 1], { type: 'SET_COLOR', color: 'blue' }));

    expect(states).to.deep.equal([
      { counter: { value: 100 }, color: { value: 'red' }, buggy: {} },
      { counter: { value: 101 }, color: { value: 'red' }, buggy: {} },
      { counter: { value: 101 }, color: { value: 'blue' }, buggy: {} }
    ]);

    expect(() => rootReducer(states[states.length - 1], { type: 'DO_ERROR' }))
      .to.throw(/I am an Error from buggy/);
    expect(consoleCalls.length).to.equal(1);
    expect(consoleCalls[0]).to.deep.equal({
      method: 'error',
      args: ['Reducer for key `buggy` threw an error:']
    });

    expect(() => rootReducer(states[states.length - 1], { type: 'DO_UNDEFINED' }))
      .to.throw(/Reducer for key `buggy` returned `undefined`/);
  });
});
