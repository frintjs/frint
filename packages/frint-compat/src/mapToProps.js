/* eslint-disable no-console */
import _ from 'lodash';
import { Observable } from 'rxjs';

export default function makeMapToProps({ observe, streamProps }) {
  return function mapToProps(opts = {}) {
    console.warn('[DEPRECATED] `mapToProps` has been deprecated. Use `observe` instead.');
    const options = {
      app: null,
      dispatch: {},
      factories: {},
      models: {},
      services: {},
      shared: null,
      state: null,
      observe: null,
      ...opts,
    };

    return (Component) => {
      return observe((app) => {
        const props = streamProps();

        // app
        if (typeof options.app === 'function') {
          props.set(options.app(app));
        }

        // dispatch
        props.setDispatch(options.dispatch, app.get('store'));

        // factories/models/services
        const providers = Object.assign(
          {},
          options.factories,
          options.models,
          options.services
        );
        _.each(providers, (providerName, propName) => {
          props.set(propName, app.get(providerName));
        });

        // shared
        if (typeof options.shared === 'function') {
          props.set(options.shared({}));

          const sharedStateObservables = [];

          app.readableApps.forEach((readableAppName) => {
            sharedStateObservables.push(
              app.getWidgetOnceAvailable$(readableAppName)
                .concatMap((readableApp) => {
                  return readableApp
                    .get('store')
                    .getState$();
                })
                .map((readableState) => {
                  return {
                    [readableAppName]: readableState
                  };
                })
            );
          });

          const shared$ = Observable
              .merge(...sharedStateObservables)
              .map(sharedState => options.shared(sharedState));
          props.set(shared$);
        }

        // state
        if (typeof options.state === 'function') {
          props.set(
            app.get('store').getState$(),
            state => options.state(state)
          );
        }

        // observe
        if (typeof options.observe === 'function') {
          props.set(options.observe(app));
        }

        return props.get$();
      })(Component);
    };
  };
}
