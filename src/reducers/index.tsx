import { TodoAction } from '../actions';
import { StoreState, Todo, TodoFilter } from '../types/index';
import { ADD_TODO, TODO_TOGGLED, FILTER_CHANGED } from '../constants/index';
import { combineReducers, Reducer } from 'redux';
import * as uuid from 'uuid/v4';

export function todos(todos: Todo[] = [], action: TodoAction): Todo[] {
  switch (action.type) {
    case ADD_TODO:
      return [...todos, { name: action.name, id: uuid(), done: false }];
    case TODO_TOGGLED:
      return todos.map(todo => {
        if (todo.id === action.id) {
          return {
            ...todo,
            done: !todo.done
          }
        }
        return todo;
      });
  }
  return todos;
}

export function shownTodos(filter: TodoFilter = TodoFilter.ALL, action: TodoAction): TodoFilter {
  switch (action.type) {
    case FILTER_CHANGED:
      return action.filter;
  }
  return filter;
}

export const rootReducer: Reducer<StoreState, TodoAction> = combineReducers({
  todos,
  shownTodos
})