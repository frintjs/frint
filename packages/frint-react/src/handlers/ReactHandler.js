import getMountableComponent from '../components/getMountableComponent';

export default {
  setData(key, value) {
    this.component.state[key] = value;
  },
  getData(key) {
    return this.component.state[key];
  },
  getProps() {
    return this.component.props;
  },
  getProp(key) {
    return this.component.props[key];
  },
  getMountableComponent,
};
