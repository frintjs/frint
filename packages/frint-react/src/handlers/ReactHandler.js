import getMountableComponent from '../components/getMountableComponent';

export default {
  setData(key, value) {
    this.component.setState({
      [key]: value,
    });
  },
  setDataWithCallback(key, value, cb) {
    this.component.setState({
      [key]: value,
    }, cb);
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
