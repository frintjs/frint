import React, { PropTypes } from 'react';
import { Observable } from 'rxjs';

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
        const observableFn = (typeof fn !== 'undefined')
          ? fn
          : () => Observable.of({});

        this.subscription = observableFn(this.context.app)
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
