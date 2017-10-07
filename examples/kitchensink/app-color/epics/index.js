import { combineEpics } from 'frint-store';

import colorEpic$ from './color';

export default combineEpics(colorEpic$);
