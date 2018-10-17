import { Todo, UIState } from '../types/index';
import { Reducer, combineReducers } from 'redux';
import { Action, handleActions } from 'redux-actions';
import { parseTodo, todoStr } from 'src/util/todo';
import * as moment from 'moment';
import { historyReducer } from './enhancers/history';
import { saveReducer } from './enhancers/storage';
import { AsyncDispatchAction } from './middleware/async-dispatch';
import { putTodos, ADD_TODO, TODO_TOGGLED, FINISH_EDIT, LOGIN_FULFILLED, SIGN_UP_FULFILLED } from 'src/actions';
import { axios } from 'src/rest/config';
import { withNewState } from './enhancers/asyncDispatchOn';

type A<T> = { type: string, payload: T }

export const todos: Reducer<Todo[], Action<any>> = handleActions({
  ADD_TODO: (todos: Todo[], action: AsyncDispatchAction<string>) => [...todos, parseTodo(action.payload as string)],

  TODO_TOGGLED: (todos: Todo[], action: A<string>) => todos.map(todo => {
    if (todo.id === action.payload) {
      return {
        ...todo,
        done: !todo.done
      }
    }
    return todo;
  }),

  DELETE_TODO_FULFILLED: (todos: Todo[], action: A<any>) => todos.filter(todo => todo.id !== action.payload.data),

  FINISH_EDIT: (todos: Todo[], action: A<string>) => todos.map(todo => {
    if (todo.id === action.payload[0]) {
      let newTodo = parseTodo(action.payload[1]);
      newTodo.id = todo.id;
      return newTodo;
    }
    return todo;
  }),

  LOGIN_FULFILLED: (todos: Todo[], action: A<string>) => todos,

  SIGN_UP_FULFILLED: (todos: Todo[], action: A<string>) => todos,

  PUT_TODOS_FULFILLED: (todos: Todo[], action: A<any>) => action.payload.map((todo: any) => {
    return {
      ...todo,
      timestamp: moment(todo.timestamp).toDate(),
      date: todo.date ? moment(todo.date).toDate() : undefined
    }
  })
},[]);

const todosDispatched = withNewState<AsyncDispatchAction<any>, Todo[]>((_, action, newState) => {
  if ([ADD_TODO, TODO_TOGGLED, FINISH_EDIT].filter(x => x === action.type).length > 0) {
    action.asyncDispatch(putTodos(newState));
  } else if (action.type === LOGIN_FULFILLED || action.type === SIGN_UP_FULFILLED) {
    action.asyncDispatch(putTodos(newState, action.payload));
  }
})(todos)

const accessTokenLS = 'at';

function getAccessToken() {
  const token = localStorage.getItem(accessTokenLS) as string;
  axios.defaults.headers = {
    'x-auth-token': token
  }
  return token;
}

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
  },
  LOGIN_FULFILLED: (ui: UIState, action: A<any>) => {
    localStorage.setItem(accessTokenLS, action.payload);
    axios.defaults.headers = {
      'x-auth-token': action.payload
    }
    return { ...ui, accessToken: action.payload, loggingIn: false };
  },
  SIGN_UP_FULFILLED: (ui: UIState, action: A<any>) => {
    localStorage.setItem(accessTokenLS, action.payload);
    axios.defaults.headers = {
      'x-auth-token': action.payload
    }
    return { ...ui, accessToken: action.payload, loggingIn: false };
  }
}, { inputValue: '', editValue: '', loggingIn: false, accessToken: getAccessToken() });

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
  todos: historyReducer(saveReducer('data', todosDispatched, loadLocal)),
  ui: ui
});
