import React from 'react';
import  { observe, streamProps } from 'frint-react';
import { Observable } from 'rxjs';

import {
  incrementCounter,
  decrementCounter
} from '../actions/counter';

const Root = React.createClass({
  render() {
    const codeStyle = {
      color: this.props.color,
      backgroundColor: this.props.color
    };

    return (
      <div>
        <h5>App: Counter</h5>

        <p>Counter value in <strong>CounterApp</strong>: <code>{this.props.counter}</code></p>

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

        <p>Color value from <strong>ColorApp</strong>: <code style={codeStyle}>{this.props.color}</code></p>

        <p>
          <a
            href="#"
            onClick={() => this.props.changeColor('blue')}
          >
            Change
          </a> to blue from here!
        </p>

        <p>
          <strong>Region Props:</strong>

          <pre><code>{JSON.stringify(this.props.regionProps, null, 2)}</code></pre>
        </p>

        <p>
          <strong>Services:</strong>

          <ul>
            <li><strong>Foo</strong> (cascaded): is from <code>{this.props.foo.getAppName()}</code></li>
            <li><strong>Bar</strong> (cascaded and scoped): is from <code>{this.props.bar.getAppName()}</code></li>
            <li><strong>Baz</strong> (not cascaded): is unavaialble - <code>{this.props.baz}</code></li>
          </ul>
        </p>
      </div>
    );
  }
});

export default observe(function (app) {
  return streamProps({}) // start with defualt props
    // map state to this Component's props
    .set(
      app.get('store').getState$(),
      state => ({ counter: state.counter.value })
    )

    // map Region's props to this Component's props
    .set(
      app.get('region').getProps$(),
      regionProps => ({ regionProps })
    )

    // map dispatchable actions
    .setDispatch(
      {
        incrementCounter,
        decrementCounter
      },
      app.get('store')
    )

    // services
    .set({
      foo: app.get('foo'),
      bar: app.get('bar'),
      baz: app.get('baz'),
    })

    // other app: ColorApp
    .set(
      app.getAppOnceAvailable$('ColorApp'),
      (colorApp) => colorApp.get('store').getState$(),
      (colorAppState) => ({ color: colorAppState.color.value })
    )
    .set(
      app.getAppOnceAvailable$('ColorApp'),
      (colorApp) => colorApp.get('store'),
      (colorAppStore) => ({
        changeColor: (color) => colorAppStore.dispatch({
          type: 'CHANGE_COLOR',
          color,
        })
      })
    )

    // return composed Observable
    .get$();
})(Root);
