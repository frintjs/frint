import { CounterActionType } from "../constants";

export interface CounterState {
  value: number;
}

const INITIAL_STATE = {
  value: 0,
};

export default function counter(state: CounterState = INITIAL_STATE, action: { type: CounterActionType }): CounterState {
  switch (action.type) {
    case CounterActionType.INCREMENT_COUNTER:
      return { value: state.value += 1 }
    case CounterActionType.DECREMENT_COUNTER:
      return { value: state.value -= 1 }
    default:
      return state;
  }
}
