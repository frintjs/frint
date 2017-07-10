import React from 'react';
import { Link, Route } from 'frint-router-react';

import AboutPageUser from './AboutPageUser';

export default function AboutPage(props) {
  const { route } = props;

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column content">
            <h2>About</h2>

            <p>About us...</p>

            {<ul>
              <li><Link to={`${route.url}/foo`} active="is-active">Foo</Link></li>
              <li><Link to={`${route.url}/bar`} active="is-active">Bar</Link></li>
              <li><Link to={`${route.url}/baz`} active="is-active">Baz</Link></li>
            </ul>}

            <h4>Props</h4>

            <pre>{JSON.stringify(props, null, 2)}</pre>

            <hr />

            <Route path={`${route.url}/:user`} component={AboutPageUser} />

            {route.isExact &&
              <p>Click on a link above</p>
            }
          </div>
        </div>
      </div>
    </section>
  );
}
