import {
  TODOS_ADD,
  TODOS_DELETE,
  TODOS_UPDATE,
} from '../constants';

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

export function updateTodo(id, title) {
  return {
    type: TODOS_UPDATE,
    id,
    title,
  };
}
