import {
  CHANGE_COLOR,
  DEFAULT_COLOR,
} from '../constants';

const INITIAL_STATE = {
  value: DEFAULT_COLOR
};

export default function color(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_COLOR:
      return Object.assign({}, {
        value: action.color
      });

    default:
      return state;
  }
}
