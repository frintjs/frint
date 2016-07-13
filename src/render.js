import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Exposes the render method.
 * Under the hood, the third party library ReactJS is abstracted away from the developer.
 *
 * @param  {Object}   app  - app instance
 * @param  {DOM node} node - component to be mounted onto this DOM node
 * @return {JSX}           - rendered component
 */
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
