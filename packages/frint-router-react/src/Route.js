import React from 'react';
import PropTypes from 'prop-types';

export default class Router extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      component: () => null,
    };
  }

  componentDidMount() {
    if (this.props.component) {
      // sync component
      this.state.component = this.props.component;
    } else if (typeof this.props.getComponent === 'function') {
      // async component
      this.props.getComponent((err, component) => {
        if (err) {
          return console.error(err);
        }

        this.state.component = component;
      });
    } else if (this.props.App) {
      // @TODO: sync App
    } else if (typeof this.props.getApp === 'function') {
      // @TODO: async App
    }
  }

  render() {
    return this.state.component;
  }
}
