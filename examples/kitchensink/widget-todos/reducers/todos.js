import _ from 'lodash';

import { TODOS_ADD, TODOS_DELETE } from '../constants';

const INITIAL_STATE = {
  records: [],
};

export default function todos(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TODOS_ADD:
      return Object.assign({}, {
        records: [
          ...state.records,
          {
            id: _.uniqueId(),
            title: action.title,
          }
        ]
      });

    case TODOS_DELETE:
      return Object.assign({}, {
        records: state.records.filter(todo => todo.id != action.id),
      });

    default:
      return state;
  }
}
