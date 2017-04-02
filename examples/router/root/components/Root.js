import React from 'react';
import { Outlet } from 'frint-react-router';

const Root = React.createClass({
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="seven columns">
            <h3>Main</h3>

            <Outlet />
          </div>

          <div className="five columns">
            <h3>Sidebar</h3>
          </div>
        </div>
      </div>
    );
  }
});

export default Root;
