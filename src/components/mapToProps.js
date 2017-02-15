import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Observable } from 'rxjs';

import h from '../h';
import isObservable from '../utils/isObservable';
import observe from './observe';
import streamProps from '../utils/streamProps';

export default function mapToProps(opts = {}) {
  console.warn('[DEPRECATED] `mapToProps` has been depcreated. Use `observe` instead.');
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

  return function (Component) {
    return observe(function (app) {
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
                }
              })
          );
        });

        props.set(
          Observable.merge(...sharedStateObservables),
          (sharedState) => options.shared(staredState)
        );
      }

      // state
      if (typeof options.state === 'function') {
        props.set(
          app.get('store').getState$(),
          (state) => options.state(state)
        );
      }

      // observe
      if (typeof options.observe === 'function') {
        props.set(options.observe(app));
      }

      return props.get$();
    })(Component);
  };
}
