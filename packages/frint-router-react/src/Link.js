import React from 'react';
import PropTypes from 'prop-types';

export default class Link extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  handleClick = (e) => {
    e.preventDefault();

    this.context.app
      .get('router')
      .push(this.props.to);

    return false;
  };

  render() {
    const { to, children, className, type } = this.props;
    const linkProps = {
      onClick: this.handleClick,
      className,
    };

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
