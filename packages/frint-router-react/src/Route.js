/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { getMountableComponent } from 'frint-react';
/* eslint-enable import/no-extraneous-dependencies */

export default class Route extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  static propTypes = {
    path: PropTypes.string,
    exact: PropTypes.bool,
    computedMatch: PropTypes.object,
    component: PropTypes.func,
    app: PropTypes.func,
  };

  constructor(...args) {
    super(...args);

    this._routerSubscription = null;
    this._appInstance = null;

    this.state = {
      component: null,
      matched: null,
    };
  }

  componentWillMount() {
    this._calculateMatchedState(this.props);
    this._calculateComponentState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._calculateMatchedState(nextProps);
    this._calculateComponentState(nextProps);
  }

  _calculateMatchedState(nextProps) {
    if (nextProps.computedMatch) {
      // in case it was subscribed before
      this._unsubscribeFromRouter();
    } else if (nextProps.path) {
      if (!this._routerSubscription || (nextProps.path !== this.props.path) || (nextProps.exact !== this.props.exact)) {
        this._unsubscribeFromRouter();

        this._routerSubscription = this.context.app
          .get('router')
          .getMatch$(nextProps.path, {
            exact: nextProps.exact,
          })
          .subscribe((matched) => {
            this.setState({
              matched,
            });
          });
      }
    }
  }

  _calculateComponentState(nextProps) {
    if (nextProps.component) {
      // component
      this._destroyRouteApp();

      this.setState({
        component: nextProps.component,
      });
    } else if (nextProps.app && (this._appInstance === null || nextProps.app !== this.props.app)) {
      // app
      this._destroyRouteApp();

      const RouteApp = nextProps.app;

      this._appInstance = new RouteApp({
        parentApp: this.context.app,
      });
      this.setState({
        component: getMountableComponent(this._appInstance)
      });
    }
  }

  componentWillUnmount() {
    this._unsubscribeFromRouter();
    this._destroyRouteApp();
  }

  _unsubscribeFromRouter() {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

  _destroyRouteApp() {
    if (this._appInstance) {
      this._appInstance.beforeDestroy();
      this._appInstance = null;
    }
  }

  render() {
    const ComponentToRender = this.state.component;
    const matched = this.props.computedMatch || this.state.matched || null;

    return ComponentToRender !== null && matched !== null
      ? <ComponentToRender match={matched} />
      : null;
  }
}
