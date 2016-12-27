/* global describe, it */
import { expect } from 'chai';

import createLoggerMiddleware from '../../src/middlewares/logger';

describe('middlewares › logger', function () {
  it('returns a function', function () {
    expect(createLoggerMiddleware()).to.be.a('function');
  });

  it('logs dispatched actions', function () {
    let consoleCallCount = 0;
    const capturedLogs = [];

    const fakeConsole = {
      group() {
        consoleCallCount += 1;
      },
      groupEnd() {
        consoleCallCount += 1;
      },
      log(...args) {
        consoleCallCount += 1;

        capturedLogs.push(args.map(function (item) {
          if (typeof item === 'string') {
            return item;
          }

          return Object.assign({}, item);
        }));
      }
    };

    const fakeState = {
      counter: {
        value: 0
      }
    };

    const fakeStore = {
      dispatch(action) {
        switch (action.type) {
          case 'INCREMENT_COUNTER':
            fakeState.counter.value += 1;
            return fakeState;

          case 'DECREMENT_COUNTER':
            fakeState.counter.value -= 1;
            return fakeState;

          default:
            return fakeState;
        }
      },

      getState() {
        return fakeState;
      }
    };

    const fakeNext = function (action) {
      fakeStore.dispatch(action);
    };

    const middleware = createLoggerMiddleware({ console: fakeConsole });
    const action = { type: 'INCREMENT_COUNTER' };

    middleware(fakeStore)(fakeNext)(action);
    expect(consoleCallCount).to.equal(5);

    // previous state
    expect(capturedLogs[0][2], {
      counter: {
        value: 0
      }
    });

    // action
    expect(capturedLogs[1][2], {
      type: 'INCREMENT_COUNTER'
    });

    // next state
    expect(capturedLogs[2][2], {
      counter: {
        value: 1
      }
    });
  });

  it('throws error if action throws error', function () {
    const fakeConsole = {
      log() { }
    };

    const fakeState = {};

    const fakeStore = {
      dispatch(action) {
        switch (action.type) {
          case 'INCREMENT_COUNTER':
            throw new Error('I am buggy');

          default:
            return fakeState;
        }
      },

      getState() {
        return fakeState;
      }
    };

    const fakeNext = function (action) {
      fakeStore.dispatch(action);
    };

    const middleware = createLoggerMiddleware({ console: fakeConsole });
    const action = { type: 'INCREMENT_COUNTER' };

    expect(function () {
      middleware(fakeStore)(fakeNext)(action);
    }).to.throw(/I am buggy/);
  });
});
