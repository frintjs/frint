/* global describe, it */
import { expect } from 'chai';
import createAsyncMiddleware from '../../src/middlewares/async';

describe('middlewares › async', function () {
  it('returns a function', function () {
    expect(createAsyncMiddleware()).to.be.a('function');
  });

  it('dispatches function when returned from an action creator', function (done) {
    const fakeStore = {
      dispatch(payload) {
        if (
          payload.type === 'SECOND_ACTION' &&
          payload.value === 20
        ) {
          done();
        }
      },

      getState() {
        return {
          counter: 10
        };
      }
    };

    const fakeAppOptions = {
      name: 'FakeApp'
    };

    const fakeApp = {
      getOption(key) {
        return fakeAppOptions[key];
      }
    };

    function actualIncrementAction(step) {
      expect(step).to.equal(5);

      done();
    }

    function incrementActionAsync(step) {
      return (dispatch, getState, { app }) => {
        if (app.getOption('name') === 'FakeApp') {
          return dispatch(actualIncrementAction(step));
        }

        return null;
      };
    }

    const middleware = createAsyncMiddleware({ app: fakeApp });

    middleware(fakeStore)()(incrementActionAsync(5));
  });
});
