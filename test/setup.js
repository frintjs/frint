/* eslint-disable wrap-iife, func-names, prefer-rest-params */
(function takeOverConsole(console) {
  let hijackedFns = {};

  function intercept(method, fn) {
    const original = console[method];
    console[method] = function () {
      fn((...args) => {
        const [f] = args;
        if (typeof f !== 'undefined') {
          original.apply(console, args);
        }
      }, arguments);
    };
    return original;
  }

  ['log', 'warn', 'error'].forEach((method) => {
    hijackedFns[method] = intercept(method, (through, [firstArg, ...rest]) => {
      if (typeof firstArg === 'string' && firstArg.startsWith('[DEPRECATED]')) {
        return;
      }
      through(firstArg, ...rest);
    });
  });

  return function reset() {
    Object.keys(hijackedFns).forEach((method) => {
      console[method] = hijackedFns[method];
    });
  };
})(console);
