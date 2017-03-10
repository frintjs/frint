import { observe, streamProps } from 'frint-react';

import {
  incrementCounter,
  decrementCounter,
} from '../actions/counter';

const Root = function ({ counter, incrementCounter, decrementCounter }) {
  return (
    <div className="container">
      <div className="row">
        <div className="eight columns">
          <h3>Counter App</h3>

          <p>Counter value: <code>{counter}</code></p>

          <div>
            <button
              className="button button-primary"
              onClick={() => incrementCounter()}
            >
              +
            </button>

            <button
              className="button"
              onClick={() => decrementCounter()}
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observe(function (app) {
  const store = app.get('store');
  return streamProps({})
    .setDispatch({ incrementCounter, decrementCounter }, store)
    .set(store.getState$())
    .get$();
})(Root);
