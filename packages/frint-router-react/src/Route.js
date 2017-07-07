import React from 'react';
import PropTypes from 'prop-types';

export default class Router extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      component: () => null,
      matched: null,
    };
  }

  componentDidMount() {
    this.subscription = this.context.app
      .get('router')
      .getMatch$(this.props.path, this.props.exact, true)
      .subscribe((matched) => {
        this.setState({
          matched,
        });
      });

    if (this.props.component) {
      // sync component
      this.setState({
        component: this.props.component,
      });
    } else if (typeof this.props.getComponent === 'function') {
      // async component
      this.props.getComponent((err, component) => {
        if (err) {
          return console.error(err);
        }

        this.setState({
          component,
        });
      });
    } else if (this.props.App) {
      // @TODO: sync App
    } else if (typeof this.props.getApp === 'function') {
      // @TODO: async App
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const ComponentToRender = this.state.component;

    return this.state.matched !== null
      ? <ComponentToRender route={this.state.matched} />
      : null;
  }
}
