/* eslint-disable no-console, no-underscore-dangle */
/* globals window */
import _ from 'lodash';
import React, { PropTypes } from 'react';

import h from '../h';
import getMountableComponent from './getMountableComponent';

export default React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    uniqueKey: PropTypes.string,
    data: PropTypes.any,
  },

  getInitialState() {
    return {
      list: [], // array of widgets ==> { name, instance }
      listForRendering: [] // array of {name, Component} objects
    };
  },

  /**
   * Determines if the the component should be updated or not.
   * Since we are calling setState multiple times, we need to make sure that only when
   * the list of widgets to render, i.e. this.state.listForRendering, is changed should
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
  },

  componentWillMount() {
    const rootApp = (!this.context || !this.context.app)
      ? window.app // @TODO: can we avoid globals?
      : this.context.app.getRootApp();

    if (!rootApp) {
      return;
    }

    const widgets$ = rootApp.getWidgets$(this.props.name, this.props.uniqueKey);

    this.subscription = widgets$.subscribe({
      next: (list) => {
        this.setState({
          list,
        }, () => {
          this.state.list.forEach((item) => {
            const widgetName = item.name;
            const widgetWeight = item.weight;
            const existsInState = this.state.listForRendering.some((w) => {
              return w.name === widgetName;
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
              !rootApp.hasWidgetInstance(widgetName, ...regionArgs)
            ) {
              rootApp.instantiateWidget(widgetName, ...regionArgs);
            }

            const widgetInstance = rootApp.getWidgetInstance(widgetName, ...regionArgs);
            if (widgetInstance) {
              this.sendProps(widgetInstance, this.props);
            }

            this.setState({
              listForRendering: this.state.listForRendering
                .concat({
                  name: widgetName,
                  weight: widgetWeight,
                  instance: widgetInstance,
                  Component: getMountableComponent(widgetInstance),
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
  },

  sendProps(widgetInstance, props) {
    const regionService = widgetInstance.get(widgetInstance.options.providerNames.region);

    if (!regionService) {
      return;
    }

    regionService.emit(props);
  },

  componentWillReceiveProps(nextProps) {
    this.state.listForRendering
      .filter(item => item.instance)
      .forEach(item => this.sendProps(item.instance, nextProps));
  },

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // @TODO: clear instances
  },

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
            <Component key={`widget-${name}`} />
          );
        })}
      </div>
    );
  }
});
