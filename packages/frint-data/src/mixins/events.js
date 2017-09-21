/* eslint-disable func-names */
export default function events(context, listeners = {}) {
  Object.defineProperty(context, '_on', {
    value: function (event, fn) {
      if (typeof listeners[event] === 'undefined') {
        listeners[event] = [];
      }

      listeners[event].push(fn);

      return function cancelListener() {
        return context._off(event, fn);
      };
    }
  });

  Object.defineProperty(context, '_trigger', {
    value: function (event, ...args) {
      if (typeof listeners[event] === 'undefined') {
        return;
      }

      return listeners[event].forEach(function (listener) { // eslint-disable-line
        listener(...args);
      });
    }
  });

  Object.defineProperty(context, '_off', {
    value: function (event = null, fn = null) {
      if (!event) {
        listeners = {}; // eslint-disable-line

        return;
      }

      if (!fn) {
        listeners[event] = [];

        return;
      }

      if (typeof listeners[event] === 'undefined') {
        return;
      }

      listeners[event].forEach(function (listener, index) {
        if (listener === fn) {
          listeners[event].splice(index, 1);
        }
      });
    }
  });
}
