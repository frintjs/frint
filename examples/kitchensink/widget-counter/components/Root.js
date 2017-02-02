import { createComponent, mapToProps } from 'frint';

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

        {/*<p>Color value from <strong>WidgetColor</strong>: <code style={codeStyle}>{this.props.color}</code></p>*/}
      </div>
    );
  }
});

export default observe(function (app) {
  const store = app.get('store');
  const state$ = store.getState$();

  return state$.scan(
    (props, state) => {
      return {
        counter: state.counter.value,
      };
    },
    {
      counter: 'n/a',

      incrementCounter(...args) { return store.dispatch(incrementCounter(...args)); },
      decrementCounter(...args) { return store.dispatch(decrementCounter(...args)); },
    }
  );
})(Root);
