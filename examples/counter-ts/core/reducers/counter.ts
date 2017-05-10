import {
  DECREMENT_COUNTER,
  INCREMENT_COUNTER,
} from "../constants";

export interface CounterInitialState {
  value: number;
}

const INITIAL_STATE = {
  value: 0,
};

export default function counter(state: CounterInitialState = INITIAL_STATE, action: { type: string }): any {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return Object.assign({}, {
        value: state.value + 1,
      });
    case DECREMENT_COUNTER:
      return Object.assign({}, {
        value: state.value - 1,
      });
    default:
      return state;
  }
}
