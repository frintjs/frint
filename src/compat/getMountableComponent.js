import React from 'react';
import ReactPlugin from '../react';

export default function makeGetMountableComponent(Frint) {
  const previousGetMountableComponent = Frint.getMountableComponent;
  const { h } = Frint;

  function getMountableComponent(app) {
    const ComponentInProvider = previousGetMountableComponent(app);

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

  ReactPlugin.getMountableComponent = getMountableComponent;
  Frint.getMountableComponent = getMountableComponent;

  return getMountableComponent;
}
