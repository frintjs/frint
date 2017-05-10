import * as React from 'react';
import { App } from 'frint';
import { observe, streamProps, ProviderProps } from 'frint-react';

import {
  incrementCounter,
  decrementCounter
} from '../actions/counter';

export interface RootProps extends ProviderProps {
  counter: number;
  incrementCounter: () => void;
  decrementCounter: () => void;
}

export class Root extends React.Component<RootProps, {}> {
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

const observeFunction = function (app: App) {
  return streamProps({}).set(
    app.get('store').getState$(),
    state => ({ counter: state.counter.value })
  ).setDispatch(
    {
      'incrementCounter': incrementCounter,
      'decrementCounter': decrementCounter,
    },
    app.get('store')
  ).get$();
};

export default observe(observeFunction)(Root);
