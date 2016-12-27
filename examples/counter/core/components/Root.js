import { createComponent, mapToProps } from 'frint';

import {
  incrementCounter,
  decrementCounter
} from '../actions/counter';

const Root = createComponent({
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="eight columns">
            <h3>Counter App</h3>

            <p>Counter value: <code>{this.props.counter}</code></p>

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
          </div>
        </div>
      </div>
    );
  }
});

export default mapToProps({
  dispatch: {
    incrementCounter,
    decrementCounter,
  },
  state(state) {
    return {
      counter: state.counter.value
    };
  }
})(Root);
