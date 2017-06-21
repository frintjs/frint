import React from 'react';
import { observe, streamProps } from 'frint-react';

import {
  incrementCounter,
  decrementCounter
} from '../actions/counter';

class Root extends React.Component {
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
}

export default observe(function (app) {
  return streamProps({})
    .set(
      app.get('store').getState$(),
      state => ({ counter: state.counter.value })
    )
    .setDispatch(
      {
        incrementCounter,
        decrementCounter,
      },
      app.get('store')
    )
    .get$();
})(Root);
