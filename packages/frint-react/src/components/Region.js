/* eslint-disable no-console, no-underscore-dangle, import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';

import composeHandlers from 'frint-component-utils/lib/composeHandlers';
import RegionHandler from 'frint-component-handlers/lib/RegionHandler';

import ReactHandler from '../handlers/ReactHandler';

export default class Region extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.any,
    name: PropTypes.string.isRequired,
    uniqueKey: PropTypes.string,
  };

  static contextTypes = {
    app: PropTypes.object,
  };

  constructor(...args) {
    super(...args);

    this._handler = composeHandlers(
      ReactHandler,
      RegionHandler,
      {
        component: this,
      },
    );

    this.state = this._handler.getInitialData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this._handler.shouldUpdate(nextProps, nextState);
  }

  componentWillMount() {
    this._handler.app = this.context.app;
    this._handler.beforeMount();
  }

  componentWillReceiveProps(nextProps) {
    this._handler.afterUpdate(nextProps);
  }

  componentWillUnmount() {
    this._handler.beforeDestroy();
  }

  render() {
    const { listForRendering } = this.state;

    if (listForRendering.length === 0) {
      return null;
    }

    const { className } = this.props;

    return (
      <div className={className}>
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
