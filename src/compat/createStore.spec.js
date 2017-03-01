/* global describe, it */
import { expect } from 'chai';

import { createStore } from './Frint';

describe('compat › createStore', function () {
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
});
