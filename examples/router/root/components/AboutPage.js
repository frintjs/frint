import React from 'react';
import { Link, Route, Switch } from 'frint-router-react';

import AboutPageUser from './AboutPageUser';

function NoUserSelected() {
  return (
    <p>No user selected.</p>
  );
}

function AboutCompany() {
  return (
    <div>
      <h3>About our company</h3>

      <p>Text here...</p>
    </div>
  );
}

export default function AboutPage(props) {
  const { match } = props;

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column content">
            <h2>About</h2>

            <p>About us...</p>

            {<ul>
              <li><Link to={`${match.url}/company`} activeClassName="is-active">Company</Link></li>
              <li>-</li>
              <li><Link to={`${match.url}/foo`} activeClassName="is-active">Foo</Link></li>
              <li><Link to={`${match.url}/bar`} activeClassName="is-active">Bar</Link></li>
              <li><Link to={`${match.url}/baz`} activeClassName="is-active">Baz</Link></li>
            </ul>}

            <h4>Props</h4>

            <pre>{JSON.stringify(props, null, 2)}</pre>

            <hr />

            {/* shows only one Route, or last one as default */}
            <Switch>
              <Route path={`${match.url}/company`} component={AboutCompany} />
              <Route path={`${match.url}/:user`} component={AboutPageUser} />
              <Route component={NoUserSelected} /> {/* default if nothing else matched */}
            </Switch>
          </div>
        </div>
      </div>
    </section>
  );
}
