/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
/* eslint-enable import/no-extraneous-dependencies */

export default class Switch extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  static propTypes = {
    children: PropTypes.node,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      history: null,
    };

    this.subscription = null;
  }

  componentWillMount() {
    this.subscription = this.context.app
      .get('router')
      .getHistory$()
      .subscribe((history) => {
        this.setState({
          history,
        });
      });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  render() {
    let child = null;

    React.Children.forEach(this.props.children, (element) => {
      if (child !== null) {
        return;
      }

      if (!React.isValidElement(element)) {
        return;
      }

      const { path, exact } = element.props;

      if (!path) {
        child = React.cloneElement(element);

        return;
      }

      const route = this.context.app
        .get('router')
        .getMatch(path, this.state.history, { exact });

      if (route !== null) {
        child = React.cloneElement(element, {
          ...element.props,
          computedRoute: route,
        });
      }
    });

    return child;
  }
}
