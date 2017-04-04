import React from 'react';
import { observe } from 'frint-react';
import { Observable } from 'rxjs';

import {
  changeColor
} from '../actions/color';
import {
  GREEN_COLOR,
  RED_COLOR
} from '../constants';

const Root = React.createClass({
  render() {
    const codeStyle = {
      color: this.props.color,
      backgroundColor: this.props.color
    };

    return (
      <div>
        <h5>App: Color</h5>

        <p>Color value in <strong>ColorApp</strong>: <code style={codeStyle}>{this.props.color}</code></p>

        <div>
          <button
            className="button"
            style={{backgroundColor: GREEN_COLOR, color: '#fff'}}
            onClick={() => this.props.changeColor(GREEN_COLOR)}
          >
            Green
          </button>

          <button
            className="button"
            style={{backgroundColor: RED_COLOR, color: '#fff'}}
            onClick={() => this.props.changeColor(RED_COLOR)}
          >
            Red
          </button>
        </div>

        <p>Counter value from <strong>CounterApp</strong>: <code>{this.props.counter}</code></p>

        <p>
          <a
            href="#"
            onClick={() => this.props.incrementCounter()}
          >
            Increment
          </a> counter from here.
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
  // self
  const store = app.get('store');
  const region = app.get('region');

  const state$ = store.getState$()
    .map((state) => {
      return {
        color: state.color.value,
      };
    });

  const regionProps$ = region.getProps$()
    .map((regionProps) => {
      return {
        regionProps,
      };
    });

  const actions$ = Observable.of({
    changeColor: (...args) => {
      return store.dispatch(changeColor(...args));
    }
  });

  const services$ = Observable.of({
    foo: app.get('foo'),
    bar: app.get('bar'),
    baz: app.get('baz'),
  });

  // other app: CounterApp
  const counterApp$ = app.getAppOnceAvailable$('CounterApp');

  const counterAppState$ = counterApp$
    .concatMap((counterApp) => {
      return counterApp
        .get('store')
        .getState$();
    })
    .map((counterState) => {
      return {
        counter: counterState.counter.value
      };
    });

  const counterAppActions$ = counterApp$
    .map((counterApp) => {
      const store = counterApp.get('store');

      return {
        incrementCounter: () => {
          return store.dispatch({ type: 'INCREMENT_COUNTER' });
        }
      }
    });

  // combine them all into props
  return state$
    .merge(regionProps$)
    .merge(actions$)
    .merge(services$)
    .merge(counterAppState$)
    .merge(counterAppActions$)
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {
      // default props to start with
      counter: 'n/a',
    });
})(Root);
