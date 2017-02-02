/* eslint-disable no-console, no-underscore-dangle */
/* globals window */
import _ from 'lodash';
import React, { PropTypes } from 'react';

import h from '../h';
import getMountableComponent from '../getMountableComponent';

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

    this.subscription = widget$.subscribe({
      next(list) => {
        this.set({
          list,
        }, () => {
          this.state.list.forEach((item) => {
            const widgetName = item.name;
            const widgetInstance = item.instance;

            const existsInState = this.state.listForRendering.some((item) => {
              return item.name === widgetName;
            });

            // @TODO: take care of removal in streamed list too?

            if (!existsInState) {
              this.setState({
                listForRendering: this.state.listForRendering.concat({
                  name: widgetName,
                  Component: getMountableComponent(widgetInstance),
                })
              });
            }
          });
        });
      },
      error(err) => {
        console.warn(`Subscription error for <Region name="${this.props.name}" />:`, err);
      }
    });
  },

  componentWillUnmount() {
    this.subscription.unsubscribe();
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
