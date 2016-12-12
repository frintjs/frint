import { createComponent, mapToProps } from '../../../../src';

import {
  incrementCounter,
  decrementCounter
} from '../actions/counter';

const Root = createComponent({
  render() {
    return (
      <div>
        <h5>Widget: Foo</h5>

        <p>Counter value from <strong>Foo</strong>: <code>{this.props.counter}</code></p>

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
