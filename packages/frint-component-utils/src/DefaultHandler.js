/* eslint-disable no-unused-vars */
/* istanbul ignore next */
export default {
  // options
  app: null,
  component: null,

  // lifecycle: creation
  initialize() {},
  beforeDestroy() {},

  // data
  getInitialData() {
    return {};
  },
  setData(key, value) {},
  setDataWithCallback(key, value, cb) {
    this.setData(key, value);
    cb();
  },
  getData(key) {},

  // props
  getProp(key) {},
  getProps() {},

  // lifecycle: mounting
  beforeMount() {},
  afterMount() {},

  // lifecycle: re-rendering
  beforeUpdate() {},
  shouldUpdate(nextProps, nextData) {},
  afterUpdate() {},

  // other
  getMountableComponent(app) {
    return app.get('component');
  }
};
