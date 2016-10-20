import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

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
          readableStores: {},
          services: {},
          factories: {},
          models: {},
        };
      },

      componentWillMount() {
        this.storeSubscriptions = {};

        this.context.app.readableApps.forEach((readableAppName) => {
          const readableAppStore = this.context.app.getStore(readableAppName);

          function generateUpdatedState() {
            const currentState = this.state;
            const readableStores = this.state.readableStores;

            return {
              ...currentState,
              readableStores: {
                ...readableStores,
                [readableAppName]: readableAppStore.getState(),
              },
            };
          }

          this.replaceState({
            ...generateUpdatedState()
          });

          this.storeSubscriptions[readableAppName] = readableAppStore.subscribe(() => {
            this.replaceState({
              ...generateUpdatedState()
            });
          });
        });

        this.setState({
          mappedAppToProps: options.app(this.context.app),
          services: _.mapValues(options.services, (serviceName) => this.context.app.getService(serviceName)),
          factories: _.mapValues(options.factories, (factoryName) => {
            return this.context.app.getFactory(factoryName);
          }),
          models: _.mapValues(options.models, (modelName) => {
            return this.context.app.getModel(modelName);
          })
        });
      },

      componentWillUnmount() {
        Object.keys(this.storeSubscriptions)
          .forEach((appName) => {
            this.storeSubscriptions[appName]();
          });
      },

      render() {
        const { mappedAppToProps, services, factories, models } = this.state;

        const combinedMapStateToProps = (...args) => {
          return {
            ...options.state(...args),
            ...options.shared(this.state.readableStores),
            ...mappedAppToProps,
            ...services,
            ...factories,
            ...models,
          };
        };

        const ConnectedComponent = connect(
          combinedMapStateToProps,
          options.dispatch,
          options.merge,
          options.options
        )(Component);

        return <ConnectedComponent {...this.props} />;
      }
    });

    WrappedComponent.contextTypes = {
      app: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired
    };

    return WrappedComponent;
  };
}
