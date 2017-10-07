/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { ReactHandler } from 'frint-react';
/* eslint-enable import/no-extraneous-dependencies */
import { createRouteHandler } from 'frint-router-component-handlers';

export default class Route extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  static propTypes = {
    path: PropTypes.string,
    exact: PropTypes.bool,
    computedMatch: PropTypes.object,
    component: PropTypes.func,
    render: PropTypes.func,
    app: PropTypes.func,
  };

  constructor(...args) {
    super(...args);

    this._handler = createRouteHandler(ReactHandler, this.context.app, this);

    this.state = this._handler.getInitialData();
  }

  componentWillMount() {
    this._handler.beforeMount();
  }

  componentWillReceiveProps(nextProps) {
    const pathChanged = (this.props.path !== nextProps.path);
    const exactChanged = (this.props.exact !== nextProps.exact);
    const appChanged = (this.props.app !== nextProps.app);

    this._handler.propsChange(nextProps, pathChanged, exactChanged, appChanged);
  }

  componentWillUnmount() {
    this._handler.beforeDestroy();
  }

  render() {
    const ComponentToRender = this._handler.getData('component');
    const matched = this.props.computedMatch || this._handler.getData('matched') || null;

    if (!matched) {
      return null;
    }

    if (ComponentToRender) {
      return <ComponentToRender match={matched} />;
    }

    if (this.props.render) {
      return this.props.render({ match: matched });
    }

    return null;
  }
}
