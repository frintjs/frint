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

    this._routerSubscription = null;
  }

  componentWillMount() {
    this._routerSubscription = this.context.app
      .get('router')
      .getHistory$()
      .subscribe((history) => {
        this.setState({
          history,
        });
      });
  }

  componentWillUnmount() {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

  render() {
    let child = null;

    React.Children.forEach(this.props.children, (element) => {
      if (child !== null) {
        return;
      }

      const { path, exact } = element.props;

      // if Route has no path (it's default) then getMatch will return match with whatever URL
      const match = this.context.app
        .get('router')
        .getMatch(path, this.state.history, { exact });

      if (match !== null) {
        child = React.cloneElement(element, {
          ...element.props,
          computedMatch: match,
        });
      }
    });

    return child;
  }
}
