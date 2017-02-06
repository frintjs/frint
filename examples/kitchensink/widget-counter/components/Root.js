import { createComponent, mapToProps, observe } from 'frint';
import { Observable } from 'rxjs';

import {
  incrementCounter,
  decrementCounter
} from '../actions/counter';

const Root = createComponent({
  render() {
    // const codeStyle = {
    //   color: this.props.color,
    //   backgroundColor: this.props.color
    // };

    return (
      <div>
        <h5>Widget: Counter</h5>

        <p>Counter value in <strong>WidgetCounter</strong>: <code>{this.props.counter}</code></p>

        <div>
          <button
            className="button button-primary"
            onClick={() => this.props.incrementCounter()}
          >
            +
          </button>

          <button
            className="button"
            onClick={() => this.props.decrementCounter()}
          >
            -
          </button>
        </div>

        <div>
          <p>Region Props:</p>

          <pre><code>{JSON.stringify(this.props.regionProps, null, 2)}</code></pre>
        </div>

        {/*<p>Color value from <strong>WidgetColor</strong>: <code style={codeStyle}>{this.props.color}</code></p>*/}
      </div>
    );
  }
});

export default observe(function (app) {
  const store = app.get('store');
  const region = app.get('region');

  // map state to this this Component's props
  const state$ = store.getState$()
    .map((state) => {
        return {
          counter: state.counter.value,
        };
      });

  // map Region's props to this Component's props
  const regionProps$ = region.getProps$()
    .map((regionProps) => {
      return {
        regionProps,
      };
    });

  // map dispatchable actions
  const actions$ = Observable.of({
    incrementCounter(...args) {
      return store.dispatch(incrementCounter(...args));
    },
    decrementCounter(...args) {
      return store.dispatch(decrementCounter(...args));
    },
  });

  // merge all props into a single object
  return state$
    .merge(regionProps$)
    .merge(actions$)
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    });
})(Root);
