import React from 'react';
import PropTypes from 'prop-types';

import Route from './Route';

export default class Outlet extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      routes: [],
    };
  }

  componentDidMount() {
    if (this.props.routes) {
      // passed as configuration via props
      this.setState({
        routes: this.props.routes,
      });
    } else {
      // check if available as config from provider
      const routesConfig = this.context.app.get('routes');

      if (Array.isArray(routesConfig)) {
        this.setState({
          routes: routesConfig,
        });
      }
    }
  }

  render() {
    if (this.props.children) {
      return this.props.children;
    }

    if (this.state.routes.length === 0) {
      return null;
    }

    const components = this.state.routes.map(function (routeProps, index) {
      // @TODO: handle routeProps.children (if any)
      return (
        <Route
          key={index}
          {...routeProps}
        />
      );
    });

    return (
      <div>
        {components}
      </div>
    );
  }
}
