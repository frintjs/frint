/**
 * ES6 version of:
 * https://github.com/gaearon/redux-thunk
 */
export default function (...args) {
  return (store) => {
    const { dispatch, getState } = store;

    return (next) => {
      return (action) => {
        if (typeof action !== 'function') {
          return next(action);
        }

        return action(dispatch, getState, ...args);
      };
    };
  };
}
