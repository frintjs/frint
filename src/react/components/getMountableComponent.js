import React from 'react';

import h from '../h';
import Provider from './Provider';

export default function getMountableComponent(app) {
  const Component = app.get('component');
  const providerProps = { app };
  const ComponentInProvider = (componentProps) => {
    return (
      <Provider {...providerProps}>
        <Component {...componentProps} />
      </Provider>
    );
  };

  app.beforeMount();

  const WrapperComponent = React.createClass({
    componentDidMount() {
      app.afterMount();
    },

    componentWillUnmount() {
      app.beforeUnmount();
    },

    render() {
      return <ComponentInProvider {...this.props} />;
    }
  });

  return WrapperComponent;
}
