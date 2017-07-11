import React from 'react';
import { Link } from 'frint-router-react';

export default function TopNav() {
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-left">
          <Link
            to="/"
            className="nav-item is-tab"
            activeClassName="is-active"
            exact
          >
            Home
          </Link>

          <Link
            to="/about"
            className="nav-item is-tab"
            activeClassName="is-active"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
