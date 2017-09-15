export default function events(context, listeners = {}) {
  Object.defineProperty(context, 'on', {
    value: function (event, fn) {
      if (typeof listeners[event] === 'undefined') {
        listeners[event] = [];
      }

      listeners[event].push(fn);

      return function cancelListener() {
        return context.off(event, fn);
      };
    }
  });

  Object.defineProperty(context, 'trigger', {
    value: function (event, ...args) {
      if (typeof listeners[event] === 'undefined') {
        return;
      }

      return listeners[event].forEach(function (listener) {
        listener(...args);
      });
    }
  });

  Object.defineProperty(context, 'off', {
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
