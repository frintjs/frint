import React from 'react';
import { Region, observe } from 'frint-react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

class Root extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="seven columns">
            <h3>Main</h3>

            <hr />

            <Region
              name="main"
              data={{
                hi: `available from props of 'main' region`,
                showSidebar: this.props.showSidebar
              }}
            />

            <hr />

            <h3>Core: {this.props.appName}</h3>

            <p>
              <a
                href="#"
                onClick={() => this.props.toggle(!this.props.showSidebar)}
              >
                Toggle sidebar
              </a>
            </p>

            <div>
              <p>
                <strong>Services:</strong>
              </p>

              <ul>
                <li><strong>Foo</strong> (self): is from <code>{this.props.foo.getAppName()}</code></li>
                <li><strong>Bar</strong> (self): is from <code>{this.props.bar.getAppName()}</code></li>
                <li><strong>Baz</strong> (self): is from <code>{this.props.baz.getAppName()}</code></li>
              </ul>
            </div>
          </div>

          {this.props.showSidebar && (
            <div className="five columns">
              <h3>Sidebar</h3>

              <hr />

              <Region
                name="sidebar"
                data={{
                  hi: `data from 'sidebar' region here`,
                  showSidebar: this.props.showSidebar
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default observe(function (app) {
  const sidebarToggle$ = (new BehaviorSubject(true))
    .map((toggleValue) => {
      return {
        showSidebar: toggleValue,
      };
    });

  const actions$ = Observable.of({
    toggle: (value) => {
      sidebarToggle$.next(value);
    }
  });

  const services$ = Observable.of({
    foo: app.get('foo'),
    bar: app.get('bar'),
    baz: app.get('baz'),
  });

  return sidebarToggle$
    .merge(actions$)
    .merge(services$)
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {
      // start with these props
      appName: app.getName(),
    });
})(Root);
