import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import PropTypes from 'prop-types'; // eslint-disable-line import/no-extraneous-dependencies

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

    this.state = {
      active: false,
    };

    this.subscription = null;
  }

  componentDidMount() {
    this.considerSubscribingToRouter(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.considerSubscribingToRouter(nextProps);
  }

  componentWillUnmount() {
    this.unsubscribeFromRouter();
  }

  considerSubscribingToRouter(nextProps) {
    if (typeof nextProps.activeClassName === 'string') {
      if (!this.subscription ||
          this.props.to !== nextProps.to ||
          this.props.exact !== nextProps.exact) {
        this.resubscribeToRouter(nextProps.to, nextProps.exact);
      }
    }
  }

  resubscribeToRouter(to, exact) {
    this.unsubscribeFromRouter();

    this.subscription = this.context.app
      .get('router')
      .getMatch$(to, { exact })
      .subscribe((matched) => {
        if (!matched) {
          return this.setState({ active: false });
        }

        return this.setState({ active: true });
      });
  }

  unsubscribeFromRouter() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleClick = (e) => {
    e.preventDefault();

    const router = this.context.app.get('router');
    const to = this.props.to;

    if (router.getMatch(to, router.getHistory(), { exact: true }) === null) {
      router.push(to);
    }
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

    if (this.state.active) {
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
