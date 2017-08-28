import DefaultHandler from './DefaultHandler';

function Handler(...handlers) {
  [DefaultHandler]
    .concat(handlers)
    .forEach(options => {
      Object.keys(options).forEach(k => {
        this[k] = options[k];

        if (typeof options[k] === 'function') {
          this[k] = this[k].bind(this);
        }
      });
    });
}

export default function composeHandlers(...handlers) {
  return new Handler(...handlers);
}
