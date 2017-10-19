import {
  CHANGE_COLOR_ASYNC
} from '../constants';
import { changeColor } from '../actions/color';

import { filter } from 'rxjs/operator/filter';
import { delay } from 'rxjs/operator/delay';
import { map } from 'rxjs/operator/map';

export default function colorEpic$(action$) {
  return action$
    ::filter(action => action.type === CHANGE_COLOR_ASYNC)
    ::delay(1000)
    ::map(action => changeColor(action.color));
}
