import React, { PropTypes } from 'react';

import h from '../h';

export default function observe(fn) {
  return (Component) => {
    const WrappedComponent = React.createClass({
      displayName: (typeof Component.displayName !== 'undefined')
        ? `observe(${Component.displayName})`
        : 'observe',

      getInitialState() {
        return {
          computedProps: {},
        };
      },

      componentWillMount() {
        this.subscription = fn(this.context.app)
          .subscribe((computedProps) => {
            this.setState({
              computedProps,
            });
          });
      },

      componentWillUnmount() {
        this.subscription.unsubscribe();
      },

      render() {
        const {
          computedProps,
        } = this.state;

        return <Component {...computedProps} {...this.props} />;
      }
    });

    WrappedComponent.contextTypes = {
      app: PropTypes.object.isRequired
    };

    return WrappedComponent;
  };
}
