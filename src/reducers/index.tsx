import { Todo, UIState } from '../types/index';
import { Reducer, combineReducers } from 'redux';
import { Action, handleActions } from 'redux-actions';
import { parseTodo } from 'src/util/todo';
import * as moment from 'moment';
import { historyReducer } from './enhancers/history';
import { saveReducer } from './enhancers/storage';

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

export const ui: Reducer<UIState, Action<any>> = handleActions({
  INPUT_CHANGED: (ui: UIState, action: A<string>) => { 
    return { ...ui, inputValue: action.payload };
  },
  ADD_TODO: (ui: UIState, action: A<string>) => { 
    return { ...ui, inputValue: '' };
  }
}, { inputValue: '' });

function loadLocal(contents: any): Todo[] {
  var todos: Todo[] = [];
  if(Array.isArray(contents)) {
    todos = contents;
  } else if (contents.todos) {
    todos = contents.todos;
  }
  todos = todos.map(todo => {
    return {
      ...todo,
      date: todo.date ? moment(todo.date).toDate() : undefined
    }
  })
  return todos;
}

export const rootReducer = combineReducers({
  todos: historyReducer(saveReducer('data', todos, loadLocal)),
  ui: ui
});
