import { App } from "frint";
import { observe, ProviderProps, streamProps } from "frint-react";
import * as React from "react";

import {
  decrementCounter,
  incrementCounter,
} from "../actions/counter";

export interface RootProps extends ProviderProps {
  counter: number;
  incrementCounter: () => void;
  decrementCounter: () => void;
}

export class Root extends React.Component<RootProps, {}> {
  public render() {
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

const observeFunction = (app: App) => {
  return streamProps({}).set(
    app.get("store").getState$(),
    (state) => ({ counter: state.counter.value }),
  ).setDispatch(
    {
      decrementCounter,
      incrementCounter,
    },
    app.get("store"),
  ).get$();
};

export default observe(observeFunction)(Root);
