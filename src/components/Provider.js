import { Component, PropTypes, Children } from 'react';

export default class Provider extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    store: PropTypes.object.isRequired
  };

  static childContextTypes = {
    app: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      app: this.app,
      store: this.store
    };
  }

  constructor(props, context) {
    super(props, context);

    this.store = props.store;
    this.app = props.app;
  }

  render() {
    return Children.only(this.props.children);
  }
}
