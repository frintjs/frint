import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export default function mapToProps(opts = {}) {
  const options = {
    app: () => {},
    dispatch: {},
    factories: {},
    merge: undefined,
    options: {},
    services: {},
    shared: () => {},
    state: () => {},
    ...opts
  };

  return (Component) => {
    const WrappedComponent = React.createClass({
      getInitialState() {
        return {
          mappedAppToProps: {},
          readableStores: {},
          services: {},
          factories: {}
        };
      },

      componentWillMount() {
        this.storeSubscriptions = {};

        this.context.app.readableApps.forEach((readableAppName) => {
          const readableAppStore = this.context.app.getStore(readableAppName);

          this.storeSubscriptions[readableAppName] = readableAppStore.subscribe(() => {
            const currentState = this.state;
            const readableStores = this.state.readableStores;

            const updatedState = {
              ...currentState,
              readableStores: {
                ...readableStores,
                [readableAppName]: readableAppStore.getState()
              }
            };

            this.replaceState(updatedState);
          });
        });

        this.setState({
          mappedAppToProps: options.app(this.context.app),
          services: _.mapValues(options.services, (serviceName) => {
            return this.context.app.getService(serviceName);
          }),
          factories: _.mapValues(options.factories, (factoryName) => {
            return this.context.app.getFactory(factoryName);
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
        const { mappedAppToProps, services, factories } = this.state;

        const combinedMapStateToProps = (...args) => {
          return {
            ...options.state(...args),
            ...options.shared(this.state.readableStores),
            ...mappedAppToProps,
            ...services,
            ...factories
          };
        };

        const ConnectedComponent = connect(
          combinedMapStateToProps,
          options.dispatch,
          options.merge,
          options.options
        )(Component);

        return <ConnectedComponent />;
      }
    });

    WrappedComponent.contextTypes = {
      app: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired
    };

    return WrappedComponent;
  };
}
