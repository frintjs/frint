import _ from 'lodash';
import React, { PropTypes } from 'react';

import isObservable from '../utils/isObservable';

export default function mapToProps(opts = {}) {
  const options = {
    app: () => {},
    dispatch: {},
    factories: {},
    merge(stateProps, dispatchProps, ownProps) {
      return {
        ...ownProps,
        ...dispatchProps,
        ...stateProps,
      };
    },
    models: {},
    options: {},
    services: {},
    shared: () => {},
    state: () => {},
    observe: null,
    ...opts,
  };

  return (Component) => {
    const WrappedComponent = React.createClass({
      displayName: (typeof Component.displayName !== 'undefined')
        ? `mapToProps(${Component.displayName})`
        : 'mapToProps',

      getInitialState() {
        return {
          mappedAppToProps: {},
          readableStates: {},
          services: {},
          factories: {},
          models: {},
        };
      },

      componentWillMount() {
        this.stateSubscriptions = {};
        this.observeSubscription = null;

        // self state
        const appName = this.context.app.getOption('name');
        this.stateSubscriptions[appName] = this.context.app.getState$()
          .subscribe((appState) => {
            this.replaceState({
              ...this.state,
              state: appState,
            });
          });

        // shared states
        this.context.app.readableApps.forEach((readableAppName) => {
          this.stateSubscriptions[readableAppName] = this.context.app
            .getState$(readableAppName)
            .subscribe((readableAppState) => {
              this.replaceState({
                ...this.state,
                readableStates: {
                  ...this.state.readableStates,
                  [readableAppName]: readableAppState
                }
              });
            });
        });

        // observe
        if (typeof options.observe === 'function') {
          const observe$ = options.observe(this.context.app);

          if (isObservable(observe$)) {
            this.observeSubscription = observe$.subscribe((observedProps) => {
              this.setState({
                observe: observedProps
              });
            });
          }
        }

        // other non-changeable mappings
        this.setState({
          mappedAppToProps: options.app(this.context.app),
          services: _.mapValues(options.services, (serviceName) => this.context.app.getService(serviceName)),
          factories: _.mapValues(options.factories, (factoryName) => {
            return this.context.app.getFactory(factoryName);
          }),
          models: _.mapValues(options.models, (modelName) => {
            return this.context.app.getModel(modelName);
          }),
          dispatch: _.mapValues(options.dispatch, (actionCreator) => {
            return () => {
              return this.context.app.dispatch(actionCreator());
            };
          })
        });
      },

      componentWillUnmount() {
        Object.keys(this.stateSubscriptions)
          .forEach((appName) => {
            this.stateSubscriptions[appName].unsubscribe();
          });
      },

      render() {
        const {
          mappedAppToProps,
          services,
          factories,
          models,
          dispatch,
          observe,
          readableStates,
          state,
        } = this.state;

        const props = {
          ...options.state(state),
          ...options.shared(readableStates),
          ...mappedAppToProps,
          ...services,
          ...factories,
          ...models,
          ...dispatch,
          ...observe,
          // @TODO: options.merge?
          // @TODO: options.options?
          ...this.props,
        };

        return <Component {...props} />;
      }
    });

    WrappedComponent.contextTypes = {
      app: PropTypes.object.isRequired
    };

    return WrappedComponent;
  };
}
