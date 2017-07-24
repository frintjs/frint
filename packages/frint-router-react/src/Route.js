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
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    app: PropTypes.func,
  };

  constructor(...args) {
    super(...args);

    this.routerSubscription = null;
    this.routeApp = null;

    this.state = {
      component: null,
      matched: null,
    };
  }

  componentWillMount() {
    this.calculateMatchedState(this.props);
    this.calculateComponentState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateMatchedState(nextProps);
    this.calculateComponentState(nextProps);
  }

  calculateMatchedState(nextProps) {
    if (nextProps.computedMatch) {
      // in case it was subscribed before
      this.unsubscribeFromRouter();

      if (!this.state.matched || (nextProps.computedMatch !== this.props.computedMatch)) {
        this.setState({
          matched: nextProps.computedMatch,
        });
      }
    } else {
      // state.matched used to be set to computedMatch and now it became null
      if (this.props.computedMatch) {
        this.setState({ matched: null });
      }

      if (nextProps.path) {
        if (!this.routerSubscription || (nextProps.path !== this.props.path) || (nextProps.exact !== this.props.exact)) {
          this.unsubscribeFromRouter();

          this.routerSubscription = this.context.app
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
  }

  calculateComponentState(nextProps) {
    if (nextProps.component) {
      // component
      this.destroyRouteApp();

      this.setState({
        component: nextProps.component,
      });
    } else if (nextProps.app && (this.routeApp === null || nextProps.app !== this.props.app)) {
      // app
      this.destroyRouteApp();

      const RouteApp = nextProps.app;

      this.routeApp = new RouteApp({
        parentApp: this.context.app,
      });
      this.setState({
        component: getMountableComponent(this.routeApp)
      });
    }
  }

  componentWillUnmount() {
    this.unsubscribeFromRouter();
    this.destroyRouteApp();
  }

  unsubscribeFromRouter() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  destroyRouteApp() {
    if (this.routeApp) {
      this.routeApp.beforeDestroy();
      this.routeApp = null;
    }
  }

  render() {
    const ComponentToRender = this.state.component;

    return ComponentToRender !== null && this.state.matched !== null
      ? <ComponentToRender match={this.state.matched} />
      : null;
  }
}
