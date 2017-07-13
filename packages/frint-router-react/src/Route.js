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

  componentDidMount() {
    // @TODO: uncomment later, since it is more optimized
    // match
    // if (this.props.computedRoute) {
    //   this.setState({
    //     matched: this.props.computedRoute,
    //   });
    // } else {
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
    // }

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
      // @TODO: async App
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  render() {
    const ComponentToRender = this.state.component;

    return this.state.matched !== null
      ? <ComponentToRender route={this.state.matched} />
      : null;
  }
}
