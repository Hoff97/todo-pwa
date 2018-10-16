import { Todo, UIState } from '../types/index';
import { Reducer, combineReducers } from 'redux';
import { Action, handleActions } from 'redux-actions';
import { parseTodo, todoStr } from 'src/util/todo';
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

  TODO_DELETED: (todos: Todo[], action: A<string>) => todos.filter(todo => todo.id !== action.payload),

  FINISH_EDIT: (todos: Todo[], action: A<string>) => todos.map(todo => {
    if (todo.id === action.payload[0]) {
      let newTodo = parseTodo(action.payload[1]);
      newTodo.id = todo.id;
      return newTodo;
    }
    return todo;
  })
},[]);

export const ui: Reducer<UIState, Action<any>> = handleActions({
  INPUT_CHANGED: (ui: UIState, action: A<any>) => { 
    return { ...ui, inputValue: action.payload };
  },
  ADD_TODO: (ui: UIState, action: A<any>) => { 
    return { ...ui, inputValue: '' };
  },
  EDIT_TODO: (ui: UIState, action: A<any>) => { 
    return { ...ui, editingTodo: action.payload.id, editValue: todoStr(action.payload) };
  },
  FINISH_EDIT: (ui: UIState, action: A<any>) => { 
    return { ...ui, editingTodo: undefined };
  },
  EDIT_CHANGE: (ui: UIState, action: A<any>) => { 
    return { ...ui, editValue: action.payload };
  },
  LOGIN_SHOW: (ui: UIState, action: A<any>) => { 
    return { ...ui, loggingIn: true };
  }
}, { inputValue: '', editValue: '', loggingIn: false });

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
      date: todo.date ? moment(todo.date).toDate() : undefined,
      timestamp: todo.timestamp ? todo.timestamp : new Date()
    }
  })
  return todos;
}

export const rootReducer = combineReducers({
  todos: historyReducer(saveReducer('data', todos, loadLocal)),
  ui: ui
});
