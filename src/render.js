import React from 'react';
import ReactDOM from 'react-dom';

export default function render(app, node) {
  const Component = app.render();

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

  return ReactDOM.render(<WrapperComponent />, node);
}
