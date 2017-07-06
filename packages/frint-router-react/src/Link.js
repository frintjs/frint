import React from 'react';

export default class Link extends React.Component {
  handleClick = () => {
    this.context.app
      .get('router')
      .go(this.prop.to);

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
