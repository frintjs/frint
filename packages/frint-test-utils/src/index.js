import { jsdom } from 'jsdom';

export function resetDOM() {
  global.document = jsdom('<html><body><div id="root"></div></body></html>');
  global.window = global.document.defaultView;
  global.location = global.window.location;
  global.navigator = { userAgent: 'node.js' };
  global.requestAnimationFrame = function requestAnimationFrame(callback) {
    setTimeout(callback, 0);
  };

  /*
  Temporary fix for chai's expect(plainObject1).to.include(plainObject2) to work.
  Until these are solved:
  - https://github.com/chaijs/type-detect/pull/91
  - https://github.com/chaijs/type-detect/issues/98
  */
  global.HTMLElement = global.window.HTMLElement;
}

export function takeOverConsole(console) {
  let hijackedFns = {};

  function intercept(method, fn) {
    const original = console[method];
    console[method] = function () { // eslint-disable-line
      fn((...args) => {
        const [f] = args;
        if (typeof f !== 'undefined') {
          original.apply(console, args);
        }
      }, arguments); // eslint-disable-line
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
}
