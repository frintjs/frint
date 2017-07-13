import React from 'react';
import PropTypes from 'prop-types';
import { getMountableComponent } from 'frint-react';

export default class Router extends React.Component {
  static contextTypes = {
    app: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    this.routeApp = null;
    this.state = {
      component: () => null,
      matched: null,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.component !== this.state.component) {
      this.setState({
        component: newProps.component,
      });
    }

    if (newProps.computedRoute !== this.state.matched) {
      this.setState({
        matched: newProps.computedRoute,
      });
    }
  }

  componentDidMount() {
    // match
    if (this.props.computedRoute) {
      this.setState({
        matched: this.props.computedRoute,
      });
    } else {
      this.subscription = this.context.app
        .get('router')
        .getMatch$(this.props.path, {
          exact: this.props.exact,
        })
        .subscribe((matched) => {
          this.setState({
            matched,
          });
        });
    }

    // component
    if (this.props.component) {
      // sync component
      this.setState({
        component: this.props.component,
      });
    } else if (typeof this.props.getComponent === 'function') {
      // async component
      this.props.getComponent((err, component) => {
        if (err) {
          return console.error(err);
        }

        this.setState({
          component,
        });
      });
    } else if (this.props.app) {
      // sync app
      const RouteApp = this.props.app;
      this.routeApp = new RouteApp({
        parentApp: this.context.app,
      });
      this.setState({
        component: getMountableComponent(this.routeApp)
      });
    } else if (typeof this.props.getApp === 'function') {
      // async App
      this.props.getApp((err, RouteApp) => {
        if (err) {
          return console.error(err);
        }

        this.routeApp = new RouteApp({
          parentApp: this.context.app,
        });
        this.setState({
          component: getMountableComponent(this.routeApp)
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.routeApp) {
      this.routeApp.beforeDestroy();
    }
  }

  render() {
    console.log(this.state);
    const ComponentToRender = this.state.component;

    return this.state.matched !== null
      ? <ComponentToRender route={this.state.matched} />
      : null;
  }
}
