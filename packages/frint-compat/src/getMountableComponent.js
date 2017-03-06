import React from 'react';
import FrintReact from 'frint-react';

export default function makeGetMountableComponent(Frint) {
  const previousGetMountableComponent = Frint.getMountableComponent;

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

  FrintReact.getMountableComponent = getMountableComponent;
  Frint.getMountableComponent = getMountableComponent;

  return getMountableComponent;
}
