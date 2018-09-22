import React, { Component } from 'react';
import { observe, streamProps } from 'frint-react';

import {
  incrementCounter,
  decrementCounter
} from '../actions/counter';

class Root extends Component {
  render() {
    const codeStyle = {
      color: this.props.color,
      backgroundColor: this.props.color
    };

    return (
      <div>
        <h5>App: Foo</h5>

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
}

export default observe(function (app) { // eslint-disable-line func-names
  const store = app.get('store');

  return streamProps()
    .setDispatch({
      incrementCounter,
      decrementCounter,
    }, store)

    .set(
      store.getState$(),
      state => ({ counter: state.counter.value })
    )

    .set(
      app.getAppOnceAvailable$('BarApp'),
      barApp => barApp.get('store').getState$(),
      barState => ({ color: barState.color.value })
    )

    .get$();
})(Root);
