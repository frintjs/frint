import { createComponent, mapToProps } from 'frint';

import {
  incrementCounter,
  decrementCounter
} from '../actions/counter';

const Root = createComponent({
  render() {
    const codeStyle = {
      color: this.props.color,
      backgroundColor: this.props.color
    };

    return (
      <div>
        <h5>Widget: Foo</h5>

        <p>Counter value in <strong>Foo</strong>: <code>{this.props.counter}</code></p>

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

        <p>Color value from <strong>Bar</strong>: <code style={codeStyle}>{this.props.color}</code></p>
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
  },
  shared(sharedState) {
    return {
      color: (typeof sharedState.WidgetBar !== 'undefined')
        ? sharedState.WidgetBar.color.value
        : 'n/a'
    };
  }
})(Root);
