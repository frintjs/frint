/* eslint-disable no-console, no-underscore-dangle */
/* globals window */
import React, { PropTypes } from 'react';

import h from '../h';
import getMountableComponent from './getMountableComponent';

export default React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    key: PropTypes.string,
    data: PropTypes.any,
  },

  getInitialState() {
    return {
      list: [], // array of widgets ==> { name, instance }
      listForRendering: [] // array of {name, Component} objects
    };
  },

  componentWillMount() {
    const rootApp = this.context.app.getRootApp();

    if (!rootApp) {
      return;
    }

    const widgets$ = rootApp.getWidgets$(this.props.name, this.props.key);

    this.subscription = widgets$.subscribe({
      next(list) {
        this.set({
          list,
        }, () => {
          this.state.list.forEach((item) => {
            const widgetName = item.name;
            const existsInState = this.state.listForRendering.some((w) => {
              return w.name === widgetName;
            });

            // @TODO: take care of removal in streamed list too?

            if (existsInState) {
              return;
            }

            if (!rootApp.hasWidgetInstance(widgetName, this.props.name, this.props.key)) {
              rootApp.instantiateWidget(widgetName, this.props.name, this.props.key);
            }

            const widgetInstance = rootApp.getWidgetInstance(widgetName, this.props.name, this.props.key);

            this.sendProps(widgetInstance, this.props);

            this.setState({
              listForRendering: this.state.listForRendering.concat({
                name: widgetName,
                Component: getMountableComponent(widgetInstance),
              })
            });
          });
        });
      },
      error(err) {
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
    this.state.list.forEach((item) => {
      this.sendProps(item.instance, nextProps);
    });
  },

  componentWillUnmount() {
    this.subscription.unsubscribe();

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
