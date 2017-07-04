import React from 'react';

export default function TopNav() {
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-left">
          <a href="/" className="nav-item brand">
            Home
          </a>

          <a href="/about" className="nav-item is-tab">
            About
          </a>
        </div>
      </div>
    </nav>
  );
}
