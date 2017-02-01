import {
  CHANGE_COLOR
} from '../constants';

export function changeColor(color) {
  return {
    type: CHANGE_COLOR,
    color
  };
}
