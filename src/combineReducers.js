/* eslint-disable prefer-template */
export default function combineReducers(reducers, options = {}) {
  const keys = Object.keys(reducers);
  const opts = {
    console: console,
    ...options,
  };

  return function rootReducer(state = {}, action) {
    let changed = false;

    const fullStateTree = {};
    keys.forEach(function processReducer(key) {
      const reducer = reducers[key];
      const previousState = state[key];
      let updatedState;

      try {
        updatedState = reducer(previousState, action);
      } catch (reducerError) {
        opts.console.error('Reducer for key `' + key + '` threw an error:');
        throw reducerError;
      }

      if (typeof updatedState === 'undefined') {
        throw new Error('Reducer for key `' + key + '` returned `undefined`');
      }

      fullStateTree[key] = updatedState;

      if (changed === true || updatedState !== previousState) {
        changed = true;
      }
    });

    return changed
      ? fullStateTree
      : state;
  };
}
