/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import composeHandlers from 'frint-component-utils/lib/composeHandlers';
import ObserveHandler from 'frint-component-handlers/lib/ObserveHandler';

import ReactHandler from '../handlers/ReactHandler';

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

        this._handler = composeHandlers(
          ReactHandler,
          ObserveHandler,
          {
            component: this,
            getProps$: typeof fn === 'function'
              ? app => fn(app, this._props$)
              : fn,
          }
        );

        this.state = this._handler.getInitialData();
        this._props$ = new BehaviorSubject(this.props);
      }

      componentWillMount() {
        this._handler.app = this.context.app;
        this._handler.beforeMount();
      }

      componentWillReceiveProps(newProps) {
        this._props$.next(newProps);
      }

      componentWillUnmount() {
        this._handler.beforeDestroy();
      }

      render() {
        const { computedProps } = this.state;

        return <Component {...computedProps} {...this.props} />;
      }
    }

    return WrappedComponent;
  };
}
