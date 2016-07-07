/* eslint-disable no-console */
import React, { PropTypes } from 'react';

// @TODO: check for an alternative to remove global dependency
function getWidgets(name) {
  return window.app.getWidgets(name);
}

function getObservable(name) {
  return window.app.observeWidgets(name);
}

function isRootAppAvailable() {
  return window.app;
}

export default React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired
  },

  componentDidMount() {
    const observable = getObservable();

    this.subscription = observable.subscribe({
      // @TODO: this can be optimized further
      next: () => {
        this.setState({
          list: getWidgets(this.props.name)
        });

        this.state.list.forEach((widget) => {
          if (!isRootAppAvailable()) {
            return;
          }

          const widgetName = widget.getOption('name');

          // @TODO: later re-implement this check with observables
          const rootApp = widget.getRootApp();
          const areDependenciesLoaded = widget.readableApps.length > 0
            ? widget.readableApps.every((readableApp) => rootApp.getStore(readableApp))
            : true;

          if (!areDependenciesLoaded) {
            return;
          }

          const existsInState = this.state.listForRendering.some((item) => {
            return item.name === widgetName;
          });

          if (existsInState) {
            return;
          }

          const WidgetComponent = widget.render();
          const WrapperComponent = React.createClass({
            componentWillMount() {
              widget.beforeMount();
            },

            componentDidMount() {
              widget.afterMount();
            },

            componentWillUnmount() {
              widget.beforeUnmount();
            },

            render() {
              return <WidgetComponent />;
            }
          });

          const { listForRendering } = this.state;
          listForRendering.push({
            name: widgetName,
            Component: WrapperComponent
          });

          this.setState({ listForRendering });
        });
      },
      error: (err) => {
        console.warn(`Subscription error for <Region name="${this.props.name}" />:`, err);
      }
    });
  },

  componentWillUnmount() {
    this.subscription.unsubscribe();
  },

  getInitialState() {
    return {
      list: [], // array of widgetApps
      listForRendering: [] // array of {name, component} objects
    };
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
            <Component key={name} />
          );
        })}
      </div>
    );
  }
});
