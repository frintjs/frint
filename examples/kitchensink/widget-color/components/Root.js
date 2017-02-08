import { createComponent, observe } from 'frint';
import { Observable } from 'rxjs';

import {
  changeColor
} from '../actions/color';
import {
  GREEN_COLOR,
  RED_COLOR
} from '../constants';

const Root = createComponent({
  render() {
    const codeStyle = {
      color: this.props.color,
      backgroundColor: this.props.color
    };

    return (
      <div>
        <h5>Widget: Color</h5>

        <p>Color value in <strong>WidgetColor</strong>: <code style={codeStyle}>{this.props.color}</code></p>

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

        <p>Counter value from <strong>WidgetCounter</strong>: <code>{this.props.counter}</code></p>

        <p>
          <a
            href="#"
            onClick={() => this.props.incrementCounter()}
          >
            Increment
          </a> counter from here.
        </p>

        <div>
          <p>Region Props:</p>

          <pre><code>{JSON.stringify(this.props.regionProps, null, 2)}</code></pre>
        </div>
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

  // other widget: WidgetCounter
  const widgetCounter$ = app.getWidgetOnceAvailable$('WidgetCounter');

  const widgetCounterState$ = widgetCounter$
    .concatMap((widgetCounter) => {
      return widgetCounter
        .get('store')
        .getState$();
    })
    .map((counterState) => {
      return {
        counter: counterState.counter.value
      };
    });

  const widgetCounterActions$ = widgetCounter$
    .map((widgetCounter) => {
      const store = widgetCounter.get('store');

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
    .merge(widgetCounterState$)
    .merge(widgetCounterActions$)
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
