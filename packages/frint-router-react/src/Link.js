import React from 'react';
import PropTypes from 'prop-types';

export default class Link extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      active: false,
    }
  }

  componentDidMount() {
    this.subscription = null;

    if (typeof this.props.active === 'string') {
      this.subscription = this.context.app
        .get('router')
        .getMatch$(this.props.to)
        .subscribe((matched) => {
          if (!matched) {
            return this.setState({ active: false });
          }

          return this.setState({ active: true });
        });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleClick = (e) => {
    e.preventDefault();

    this.context.app
      .get('router')
      .push(this.props.to);

    return false;
  };

  render() {
    const {
      to,
      children,
      className,
      type,
      active,
    } = this.props;

    const linkProps = {
      onClick: this.handleClick,
      className: className || '',
    };

    if (this.state.active) {
      linkProps.className += ' ' + active;
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
