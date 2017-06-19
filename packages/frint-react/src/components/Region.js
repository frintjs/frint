/* eslint-disable no-console, no-underscore-dangle, import/no-extraneous-dependencies */
/* globals window */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import getMountableComponent from './getMountableComponent';

export default class Region extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    uniqueKey: PropTypes.string,
    data: PropTypes.any,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      list: [], // array of apps ==> { name, instance }
      listForRendering: [] // array of {name, Component} objects
    };
  }

  /**
   * Determines if the the component should be updated or not.
   * Since we are calling setState multiple times, we need to make sure that only when
   * the list of apps to render, i.e. this.state.listForRendering, is changed should
   * trigger a re-render of the region component.
   * @param  {Object}  nextProps  the next set of props
   * @param  {Object}  nextState  the next component state to be set
   * @return {Boolean} a boolean flag indicating whether the component should be updated
   */
  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = !_.isEqual(this.props, nextProps);
    if (!shouldUpdate) {
      const { listForRendering } = nextState;
      shouldUpdate = shouldUpdate || this.state.listForRendering.length !== listForRendering.length;
      shouldUpdate = shouldUpdate ||
        _.zipWith(this.state.listForRendering, listForRendering, (prev, next) => prev.name === next.name)
          .some(value => !value);
    }
    return shouldUpdate;
  }

  componentWillMount() {
    const rootApp = (!this.context || !this.context.app)
      ? window.app // @TODO: can we avoid globals?
      : this.context.app.getRootApp();

    if (!rootApp) {
      return;
    }

    this.rootApp = rootApp;
    const apps$ = rootApp.getApps$(this.props.name, this.props.uniqueKey);

    this.subscription = apps$.subscribe({
      next: (list) => {
        this.setState({
          list,
        }, () => {
          this.state.list.forEach((item) => {
            const { name: appName, weight: appWeight, multi } = item;
            const existsInState = this.state.listForRendering.some((w) => {
              return w.name === appName;
            });

            // @TODO: take care of removal in streamed list too?

            if (existsInState) {
              return;
            }

            const regionArgs = this.props.uniqueKey
              ? [this.props.name, this.props.uniqueKey]
              : [this.props.name];

            if (
              this.props.uniqueKey &&
              !rootApp.hasAppInstance(appName, ...regionArgs)
            ) {
              rootApp.instantiateApp(appName, ...regionArgs);
            }

            const appInstance = rootApp.getAppInstance(appName, ...regionArgs);
            if (appInstance) {
              this.sendProps(appInstance, this.props);
            }

            this.setState({
              listForRendering: this.state.listForRendering
                .concat({
                  name: appName,
                  weight: appWeight,
                  instance: appInstance,
                  multi: multi,
                  Component: getMountableComponent(appInstance),
                })
                .sort((a, b) => {
                  return a.weight - b.weight;
                })
            });
          });
        });
      },
      error: (err) => {
        console.warn(`Subscription error for <Region name="${this.props.name}" />:`, err);
      }
    });
  }

  sendProps(appInstance, props) { // eslint-disable-line
    const regionService = appInstance.get(appInstance.options.providerNames.region);

    if (!regionService) {
      return;
    }

    regionService.emit(props);
  }

  componentWillReceiveProps(nextProps) {
    this.state.listForRendering
      .filter(item => item.instance)
      .forEach(item => this.sendProps(item.instance, nextProps));
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.rootApp) {
      this.state.listForRendering
        .filter(item => item.multi)
        .forEach((item) => {
          this.rootApp.destroyApp(
            item.name,
            this.props.name,
            this.props.uniqueKey
          );
        });
    }
  }

  render() {
    const { listForRendering } = this.state;

    if (listForRendering.length === 0) {
      return null;
    }

    return (
      <div>
        {listForRendering.map((item) => {
          const { Component, name } = item;

          return (
            <Component key={`app-${name}`} />
          );
        })}
      </div>
    );
  }
}
