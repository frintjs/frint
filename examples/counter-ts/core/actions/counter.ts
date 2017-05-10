import { CounterActionType } from "../constants";

export interface CounterAction {
  type: CounterActionType;
}

export function incrementCounter() : CounterAction {
  return {
    type: CounterActionType.INCREMENT_COUNTER,
  };
}

export function decrementCounter() {
  return {
    type: CounterActionType.DECREMENT_COUNTER,
  };
}
