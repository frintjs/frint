import React from 'react';
import { Link } from 'frint-router-react';

export default function AboutPage(props) {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column content">
            <h2>About</h2>

            <p>About us...</p>

            {<ul>
              <li><Link to={`${props.route.url}/foo`}>Foo</Link></li>
              <li><Link to={`${props.route.url}/bar`}>Bar</Link></li>
              <li><Link to={`${props.route.url}/baz`}>Baz</Link></li>
            </ul>}

            <h4>Props</h4>

            <pre>{JSON.stringify(props, null, 2)}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
