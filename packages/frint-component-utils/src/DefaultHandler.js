/* eslint-disable no-unused-vars */
export default {
  // options
  app: null,
  component: null,

  // lifecycle: creation
  initialize() {
    return null;
  },
  beforeDestroy() {
    return null;
  },

  // data
  getInitialData() {
    return {};
  },
  setData(key, value) {
    return null;
  },
  setDataWithCallback(key, value, cb) {
    this.setData(key, value);
    cb();
  },
  getData(key) {
    return null;
  },

  // props
  getProp(key) {
    return null;
  },
  getProps() {
    return {};
  },

  // lifecycle: mounting
  beforeMount() {
    return null;
  },
  afterMount() {
    return null;
  },

  // lifecycle: re-rendering
  beforeUpdate() {
    return null;
  },
  shouldUpdate(nextProps, nextData) {
    return true;
  },
  afterUpdate() {
    return null;
  },

  // other
  getMountableComponent(app) {
    return null;
  }
};
