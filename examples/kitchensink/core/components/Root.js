import { createComponent, Region, observe } from 'frint';
import { Observable, BehaviorSubject } from 'rxjs';

const Root = createComponent({
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="eight columns">
            <h3>Main</h3>

            <hr />

            <Region
              name="main"
              data={{hi: `available from props of 'main' region`}}
            />

            <a
              href="#"
              onClick={() => this.props.toggle(!this.props.showSidebar)}
            >
              Toggle
            </a>
          </div>

          {this.props.showSidebar && (
            <div className="four columns">
              <h3>Sidebar</h3>

              <hr />

              <Region name="sidebar" data={{hi: `data from 'sidebar' region here`}} />
            </div>
          )}
        </div>
      </div>
    );
  }
});

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

  return sidebarToggle$
    .merge(actions$)
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {});
})(Root);
