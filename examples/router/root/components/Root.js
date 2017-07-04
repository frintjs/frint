import React from 'react';

import TopNav from './TopNav';

export default function Root() {
  return (
    <div>
      <TopNav />

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column content">
              <p>Hello World</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
