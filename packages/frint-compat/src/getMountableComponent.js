/* eslint-disable import/no-extraneous-dependencies, class-methods-use-this */
import React from 'react';
import FrintReact from 'frint-react';

export default function makeGetMountableComponent(Frint) {
  const previousGetMountableComponent = Frint.getMountableComponent;

  function getMountableComponent(app) {
    const ComponentInProvider = previousGetMountableComponent(app);

    app.beforeMount();

    class WrapperComponent extends React.Component {
      componentDidMount() {
        app.afterMount();
      }

      componentWillUnmount() {
        app.beforeUnmount();
      }

      render() {
        return <ComponentInProvider {...this.props} />;
      }
    }

    return WrapperComponent;
  }

  FrintReact.getMountableComponent = getMountableComponent;
  Frint.getMountableComponent = getMountableComponent;

  return getMountableComponent;
}
