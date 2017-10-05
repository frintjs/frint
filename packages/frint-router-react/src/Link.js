import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import PropTypes from 'prop-types'; // eslint-disable-line import/no-extraneous-dependencies
import { createLinkHandler } from 'frint-router-component-handlers';
import { ReactHandler } from 'frint-react';

export default class Link extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  static propTypes = {
    to: PropTypes.string.isRequired,
    exact: PropTypes.bool,
    type: PropTypes.string,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    children: PropTypes.node,
  };

  constructor(...args) {
    super(...args);

    this._handler = createLinkHandler(ReactHandler, this.context.app, this);

    this.state = this._handler.getInitialData();
  }

  componentDidMount() {
    this._handler.beforeMount();
  }

  componentWillReceiveProps(nextProps) {
    const toChanged = (this.props.to !== nextProps.to);
    const exactChanged = (this.props.exact !== nextProps.exact);

    this._handler.propsChange(nextProps, toChanged, exactChanged);
  }

  componentWillUnmount() {
    this._handler.beforeDestroy();
  }

  handleClick = (e) => {
    e.preventDefault();

    this._handler.handleClick();
  };

  render() {
    const {
      to,
      children,
      className,
      type,
      activeClassName,
    } = this.props;

    const linkProps = {
      onClick: this.handleClick,
      className: className || '',
    };

    if (this._handler.getData('active')) {
      linkProps.className += ` ${activeClassName}`;
    }

    if (typeof type === 'undefined') {
      // anchor
      linkProps.href = to;

      return (
        <a {...linkProps}>
          {children}
        </a>
      );
    }

    // button
    linkProps.type = type;

    return (
      <button {...linkProps}>
        {children}
      </button>
    );
  }
}
