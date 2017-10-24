import React from 'react';
import { observe } from 'frint-react';
import { Observable } from 'rxjs/Observable';
import { concatMap } from 'rxjs/operator/concatMap';
import { map } from 'rxjs/operator/map';
import { merge } from 'rxjs/operator/merge';
import { scan } from 'rxjs/operator/scan';
import PropTypes from 'prop-types';

import {
  changeColor
} from '../actions/color';

import {
  GREEN_COLOR,
  RED_COLOR,
  ORANGE_COLOR,
  CHANGE_COLOR_ASYNC
} from '../constants';

class Root extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    counter: PropTypes.number,
    incrementCounter: PropTypes.func,
    decrementCounter: PropTypes.func,
    changeColor: PropTypes.func,
    changeColorAsync: PropTypes.func,
    regionProps: PropTypes.object,
    foo: PropTypes.object,
    bar: PropTypes.object,
    baz: PropTypes.object
  };

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
            onClick={() => this.props.changeColor(GREEN_COLOR)}
            style={{ backgroundColor: GREEN_COLOR, color: '#fff' }}
          >
            Green
          </button>

          <button
            className="button"
            onClick={() => this.props.changeColor(RED_COLOR)}
            style={{ backgroundColor: RED_COLOR, color: '#fff' }}
          >
            Red
          </button>

          <button
            className="button"
            onClick={() => this.props.changeColorAsync(ORANGE_COLOR)}
            style={{ backgroundColor: ORANGE_COLOR, color: '#fff' }}
          >
            Async
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

        <div>
          <p>
            <strong>Region Props:</strong>
          </p>

          <pre><code>{JSON.stringify(this.props.regionProps, null, 2)}</code></pre>
        </div>

        <div>
          <p>
            <strong>Services:</strong>
          </p>

          <ul>
            <li><strong>Foo</strong> (cascaded): is from <code>{this.props.foo.getAppName()}</code></li>
            <li><strong>Bar</strong> (cascaded and scoped): is from <code>{this.props.bar.getAppName()}</code></li>
            <li><strong>Baz</strong> (not cascaded): is unavaialble - <code>{this.props.baz}</code></li>
          </ul>
        </div>
      </div>
    );
  }
}


export default observe(function (app) { // eslint-disable-line func-names
  // self
  const store = app.get('store');
  const region = app.get('region');

  const state$ = store.getState$()
    ::map((state) => {
      return {
        color: state.color.value,
      };
    });

  const regionProps$ = region.getProps$()
    ::map((regionProps) => {
      return {
        regionProps,
      };
    });

  const actions$ = Observable.of({
    changeColor: (...args) => {
      return store.dispatch(changeColor(...args));
    },
    changeColorAsync: (color) => {
      return store.dispatch({
        type: CHANGE_COLOR_ASYNC,
        color,
      });
    },
  });

  const services$ = Observable.of({
    foo: app.get('foo'),
    bar: app.get('bar'),
    baz: app.get('baz'),
  });

  // other app: CounterApp
  const counterApp$ = app.getAppOnceAvailable$('CounterApp');
  const counterAppState$ = counterApp$
    ::concatMap((counterApp) => {
      return counterApp
        .get('store')
        .getState$();
    })
    ::map((counterState) => {
      return {
        counter: counterState.counter.value
      };
    });

  const counterAppActions$ = counterApp$
    ::map((counterApp) => {
      const counterStore = counterApp.get('store');
      return {
        incrementCounter: () => {
          return counterStore.dispatch({ type: 'INCREMENT_COUNTER' });
        }
      };
    });

  // combine them all into props
  return state$
    ::merge(regionProps$)
    ::merge(actions$)
    ::merge(services$)
    ::merge(counterAppState$)
    ::merge(counterAppActions$)
    ::scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {
      // default props to start with
      counter: 0,
    });
})(Root);
