export default function createClass(extend = {}) {
  class GeneratedClass {
    constructor(...args) {
      Object.keys(extend)
        .forEach((key) => {
          if (typeof extend[key] === 'function') {
            this[key] = extend[key].bind(this);
          } else {
            this[key] = extend[key];
          }
        });

      if (typeof this.initialize === 'function') {
        this.initialize(...args);
      }
    }
  }

  return GeneratedClass;
}
