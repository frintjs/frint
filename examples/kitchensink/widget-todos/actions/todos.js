import { TODOS_ADD, TODOS_DELETE } from '../constants';

export function addTodo(title) {
  return {
    type: TODOS_ADD,
    title,
  };
}

export function removeTodo(id) {
  return {
    type: TODOS_DELETE,
    id,
  };
}
