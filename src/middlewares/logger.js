/* eslint-disable no-console */
export default function (options = {}) {
  const opts = {
    throwError: true,
    ...options,
  };

  return store => next => action => { // eslint-disable-line
    let nextAction;
    let error;

    const prevState = store.getState();

    try {
      nextAction = next({
        ...action,
      });
    } catch (e) {
      error = e;
    }

    if (opts.throwError && error) {
      throw error;
    }

    const d = new Date();
    const groupName = `action @ ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()} ${action.type}`;

    if (typeof console.group === 'function') {
      console.group(groupName);
    }

    console.log('%cprevious state', 'color: #9e9e9e; font-weight: bold;', prevState);
    console.log('%caction', 'color: #33c3f0; font-weight: bold;', action);
    console.log('%ccurrent state', 'color: #4cAf50; font-weight: bold;', store.getState());

    if (typeof console.group === 'function') {
      console.groupEnd();
    }

    return nextAction;
  };
}
