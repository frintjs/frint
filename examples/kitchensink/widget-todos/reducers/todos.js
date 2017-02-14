import _ from 'lodash';

import {
  TODOS_ADD,
  TODOS_DELETE,
  TODOS_UPDATE,
} from '../constants';

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

    case TODOS_UPDATE:
      return Object.assign({}, {
        records: state.records
          .map((todo) => {
            if (todo.id !== action.id) {
              return todo;
            }

            todo.title = action.title;

            return todo;
          })
      });

    default:
      return state;
  }
}
