import { createComponent, mapToProps } from '../../../../src';

import {
  changeColor
} from '../actions/color';
import {
  BLUE_COLOR,
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
        <h5>Widget: Bar</h5>

        <p>Color value from <strong>Bar</strong>: <code style={codeStyle}>{this.props.color}</code></p>

        <div>
          <button
            className="button button-primary"
            onClick={() => this.props.changeColor(BLUE_COLOR)}
          >
            Blue
          </button>

          <button
            className="button"
            style={{backgroundColor: RED_COLOR, color: '#fff'}}
            onClick={() => this.props.changeColor(RED_COLOR)}
          >
            Red
          </button>
        </div>

        <p>Counter value from <strong>Foo</strong>: <code>{this.props.counter}</code></p>
      </div>
    );
  }
});

export default mapToProps({
  dispatch: {
    changeColor,
  },
  state(state) {
    return {
      color: state.color.value
    };
  },
  shared(sharedState) {
    return {
      counter: (typeof sharedState.WidgetFoo !== 'undefined')
        ? sharedState.WidgetFoo.counter.value
        : 'n/a'
    };
  }
})(Root);
