/* eslint-disable no-console, no-underscore-dangle, import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import zipWith from 'lodash/zipWith';

import getMountableComponent from './getMountableComponent';

export default class Region extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    uniqueKey: PropTypes.string,
    data: PropTypes.any,
  };

  static contextTypes = {
    app: PropTypes.object,
  };

  static sendProps(appInstance, props) {
    const regionService = appInstance.get(appInstance.options.providerNames.region);

    if (!regionService) {
      return;
    }

    regionService.emit(props);
  }

  constructor(props, context) {
    super(props, context);

    if (context.app) {
      const rootApp = context.app.getRootApp();
      const list = rootApp._appsCollection.filter(({ regions }) => {
        return regions.some(name => props.name === name);
      });

      this.state = {
        list,
        listForRendering: this.getListForRendering(list, rootApp)
      };
    } else {
      this.state = {
        list: [], // array of apps ==> { name, instance }
        listForRendering: [] // array of { name, Component } objects
      };
    }
  }

  getListForRendering(list, rootApp, listForRendering = []) {
    const {
      children,
      className,
      ...props
    } = this.props;

    return list
      .map((item) => {
        const {
          name,
          weight,
          multi
        } = item;
        const isPresent = listForRendering.some((w) => {
          return w.name === name;
        });

        // @TODO: take care of removal in streamed list too?
        if (isPresent) {
          return null;
        }

        const regionArgs = this.props.uniqueKey
          ? [this.props.name, this.props.uniqueKey]
          : [this.props.name];

        if (
          this.props.uniqueKey &&
          !rootApp.hasAppInstance(name, ...regionArgs)
        ) {
          rootApp.instantiateApp(name, ...regionArgs);
        }

        const instance = rootApp.getAppInstance(name, ...regionArgs);

        if (instance) {
          Region.sendProps(instance, props);
        }

        return {
          name,
          weight,
          instance,
          multi,
          Component: getMountableComponent(instance),
        };
      })
      .filter(item => !!item)
      .concat(listForRendering)
      .sort((a, b) => a.weight - b.weight);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = !isEqual(this.props, nextProps);

    if (!shouldUpdate) {
      const { listForRendering } = nextState;
      shouldUpdate = shouldUpdate || this.state.listForRendering.length !== listForRendering.length;
      shouldUpdate = shouldUpdate ||
        zipWith(this.state.listForRendering, listForRendering, (a, b) => a.name === b.name)
          .some(value => !value);
    }

    return shouldUpdate;
  }

  componentDidMount() {
    if (!this.context.app) {
      return;
    }

    const rootApp = this.context.app.getRootApp();

    this.rootApp = rootApp;
    const apps$ = rootApp.getApps$(
      this.props.name,
      this.props.uniqueKey
    );

    this._subscription = apps$.subscribe({
      next: (list) => {
        this.setState({
          list,
          listForRendering: this.getListForRendering(list, rootApp, this.state.listForRendering)
        });
      },
      error: (err) => {
        console.warn(`Subscription error for <Region name="${this.name}" />:`, err);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      children,
      className,
      ...props
    } = nextProps;

    this.state.listForRendering
      .filter(item => item.instance)
      .forEach(item => Region.sendProps(item.instance, props));
  }

  componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
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

    const { className, children, ...props } = this.props;

    if (typeof children === 'function') {
      return (
        <div className={className}>
          {children(listForRendering, props)}
        </div>
      );
    }

    return (
      <div className={className}>
        {listForRendering.map((item) => {
          const { Component, name } = item;

          return (
            <Component {...props} key={`app-${name}`} />
          );
        })}
      </div>
    );
  }
}
