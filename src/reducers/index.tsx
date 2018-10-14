import { Todo } from '../types/index';
import { Reducer } from 'redux';
import { Action, handleActions } from 'redux-actions';
import { parseTodo } from 'src/util/todo';

type A<T> = { type: string, payload: T }

export const todos: Reducer<Todo[], Action<any>> = handleActions({
  ADD_TODO: (todos: Todo[], action: A<string>) => [...todos, parseTodo(action.payload)],

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