import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Observable } from 'rxjs';

import h from '../h';
import isObservable from '../utils/isObservable';
import mergeServicesAndFactories from '../_mergeServicesAndFactories'; // TODO: get rid of this when factories are removed

export default function mapToProps(opts = {}) {
  if ('factories' in opts) {
    console.warn('[DEPRECATED] `factories` options has been deprecated! Use `services` instead.'); // eslint-disable-line no-console
  }

  const options = {
    app: () => {},
    dispatch: {},
    factories: {},
    models: {},
    services: {},
    shared: () => {},
    state: () => {},
    observe: null,
    ...opts,
  };

  mergeServicesAndFactories(options); // TODO: get rid of this when factories are removed

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
            this.setState({
              state: appState,
            });
          });

        // shared states
        this.setState({
          readableStates: {}
        });
        this.context.app.readableApps.forEach((readableAppName) => {
          const readableAppState$ = this.context.app
            .getState$(readableAppName);

          // shared state, that is already available
          if (readableAppState$ !== null) {
            this.stateSubscriptions[readableAppName] = readableAppState$
              .subscribe((readableAppState) => {
                this.setState({
                  readableStates: {
                    ...this.state.readableStates,
                    [readableAppName]: readableAppState
                  }
                });
              });
          }

          // shared state, that we need to wait for to load
          if (readableAppState$ === null) {
            const interval$ = Observable
              .interval(100) // check every X ms
              .filter(() => {
                if (this.context.app.getState$(readableAppName) !== null) {
                  return true;
                }

                return false;
              });

            const intervalSubscription = interval$
              .subscribe(() => {
                // this will fire only once
                this.stateSubscriptions[readableAppName] = this.context.app
                  .getState$(readableAppName)
                  .subscribe((readableAppState) => {
                    this.setState({
                      readableStates: {
                        ...this.state.readableStates,
                        [readableAppName]: readableAppState
                      }
                    });
                  });

                // clean up soon after subscribing to new state
                intervalSubscription.unsubscribe();
              });
          }
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
          services: _.mapValues(options.services, serviceName => this.context.app.getService(serviceName)),
          models: _.mapValues(options.models, (modelName) => {
            return this.context.app.getModel(modelName);
          }),
          dispatch: _.mapValues(options.dispatch, (actionCreator) => {
            return (...args) => {
              return this.context.app.dispatch(actionCreator(...args));
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
          ...models,
          ...dispatch,
          ...observe,
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
