/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
/* eslint-enable import/no-extraneous-dependencies */
import { createSwitchHandler } from 'frint-router-component-handlers';
import { ReactHandler } from 'frint-react';

export default class Switch extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  static propTypes = {
    children: PropTypes.node,
  };

  constructor(...args) {
    super(...args);

    this._handler = createSwitchHandler(ReactHandler, this.context.app, this);

    this.state = this._handler.getInitialData();
  }

  componentWillMount() {
    this._handler.beforeMount();
  }

  componentWillUnmount() {
    this._handler.beforeDestroy();
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

      // if Route has no path (it's default) then getMatch will return match with whatever URL
      const match = this._handler.getMatch(path, { exact });

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
