/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';

export default function observe(fn) {
  return (Component) => {
    class WrappedComponent extends React.Component {
      static displayName = (typeof Component.displayName !== 'undefined')
        ? `observe(${Component.displayName})`
        : 'observe';

      static contextTypes = {
        app: PropTypes.object.isRequired
      };

      constructor(...args) {
        super(...args);

        this.state = {
          computedProps: {},
        };
      }

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
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      render() {
        const {
          computedProps,
        } = this.state;

        return <Component {...computedProps} {...this.props} />;
      }
    }

    return WrappedComponent;
  };
}
