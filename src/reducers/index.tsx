import { StoreState, Todo, TodoFilter } from '../types/index';
import { combineReducers, Reducer } from 'redux';
import * as uuid from 'uuid/v4';
import { FILTER_CHANGED } from 'src/actions';
import { Action, handleActions, handleAction } from 'redux-actions';

type A<T> = { type: string, payload: T }

export const todos: Reducer<Todo[], Action<any>> = handleActions({
  ADD_TODO: (todos: Todo[], action: A<string>) => [...todos, { name: action.payload, id: uuid(), done: false }],

  TODO_TOGGLED: (todos: Todo[], action: A<string>) => todos.map(todo => {
    if (todo.id === action.payload) {
      return {
        ...todo,
        done: !todo.done
      }
    }
    return todo;
  }),

  TODO_DELETED: (todos: Todo[], action: A<string>) => todos.filter(todo => todo.id !== action.payload)
},[]);


export const shownTodos: Reducer<TodoFilter, Action<any>> = handleAction(FILTER_CHANGED, 
  (filter: TodoFilter, action: A<TodoFilter>) => action.payload, 
  TodoFilter.ALL);

export const rootReducer: Reducer<StoreState, Action<any>> = combineReducers({
  todos,
  shownTodos
})