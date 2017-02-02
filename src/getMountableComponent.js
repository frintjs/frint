import React from 'react';
import ReactDOM from 'react-dom';

import h from './h';

export default function getMountableComponent(app) {
  const Component = app.getComponent();

  app.beforeMount();

  const WrapperComponent = React.createClass({
    componentDidMount() {
      app.afterMount();
    },

    componentWillUnmount() {
      app.beforeUnmount();
    },

    render() {
      return <Component />;
    }
  });

  return WrapperComponent;
}
