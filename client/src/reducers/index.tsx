import { Todo, UIState } from '../types/index';
import { Reducer, combineReducers } from 'redux';
import { Action, handleActions } from 'redux-actions';
import { parseTodo, todoStr } from 'src/util/todo';
import * as moment from 'moment';
import { historyReducer } from './enhancers/history';
import { saveReducer } from './enhancers/storage';
import { AsyncDispatchAction } from './middleware/async-dispatch';
import { putTodos, ADD_TODO, TODO_TOGGLED, FINISH_EDIT, LOGIN_FULFILLED, SIGN_UP_FULFILLED, addFileDone, getUserSettings } from 'src/actions';
import { withNewState } from './enhancers/asyncDispatchOn';
import { setAccessToken, setupAccessToken, removeAccessToken } from 'src/util/auth';
import * as uuid from 'uuid/v4';
import { dataSize } from 'src/util/util';
import { promptInstall, routerHistory } from 'src';
import { routerReducer } from 'react-router-redux';
import { AsyncFinishAction } from './middleware/after-finish';

type A<T> = { type: string, payload: T }

const reader = new FileReader();

const maxFileSize = 1000*500;

export const todos: Reducer<Todo[], Action<any>> = handleActions({
  ADD_TODO: (todos: Todo[], action: AsyncDispatchAction<string>) => [...todos, parseTodo(action.payload as string)],

  TODO_TOGGLED: (todos: Todo[], action: A<string>) => todos.map(todo => {
    if (todo.id === action.payload) {
      return {
        ...todo,
        done: !todo.done,
        timestamp: new Date()
      };
    }
    return todo;
  }),

  DELETE_TODO_FULFILLED: (todos: Todo[], action: A<any>) => todos.filter(todo => todo.id !== action.payload.data),

  FINISH_EDIT: (todos: Todo[], action: A<string>) => todos.map(todo => {
    if (todo.id === action.payload[0]) {
      let newTodo = parseTodo(action.payload[1]);
      newTodo.id = todo.id;
      newTodo.timestamp = new Date();
      newTodo.comment = todo.comment;
      newTodo.files = todo.files;
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
    };
  }),

  ADD_FILE: (todos: Todo[], action: AsyncDispatchAction<any>) => {
    let file = action.payload[1] as File;
    console.log(file.size);
    if (file.size <= maxFileSize) {
      reader.readAsDataURL(file);
      reader.onload = event => {
        if (event.target && (event.target as any).result) {
          action.asyncDispatch(addFileDone(action.payload[0], file, (event.target as any).result));
        }
      };
    } else {
      alert(`Sorry, this file is to large (${dataSize(file.size)}). Maximum file size is ${dataSize(maxFileSize)}`)
    }
    return todos;
  },

  ADD_FILE_DONE: (todos: Todo[], action: AsyncDispatchAction<any>) => {
    let newTodos: Todo[] = todos.map(todo => {
      if (todo.id === action.payload[0]) {
        let file = action.payload[1] as File;
        return {
          ...todo,
          files: [...todo.files, {
            id: uuid(),
            name: file.name,
            data: action.payload[2] as string,
            todoFk: action.payload[0],
            timestamp: new Date()
          }]
        }
      }
      return todo;
    });
    action.asyncDispatch(putTodos(newTodos));
    return newTodos;
  },

  DELETE_FILE_FULFILLED: (todos: Todo[], action: AsyncDispatchAction<any>) => todos.map(todo => {
    if (todo.id === action.payload[1]) {
      return {
        ...todo,
        files: todo.files.filter(x => x.id !== action.payload[0])
      }
    }
    return todo;
  }),

  COMMENT_CHANGED: (todos: Todo[], action: AsyncDispatchAction<any>) => todos.map(todo => {
    if (todo.id === action.payload[0]) {
      return {
        ...todo,
        comment: action.payload[1]
      }
    }
    return todo;
  })
}, []);

const todosDispatched = withNewState<AsyncDispatchAction<any>, Todo[]>((_, action, newState) => {
  if ([ADD_TODO, TODO_TOGGLED, FINISH_EDIT].filter(x => x === action.type).length > 0) {
    action.asyncDispatch(putTodos(newState));
  } else if (action.type === LOGIN_FULFILLED || action.type === SIGN_UP_FULFILLED) {
    action.asyncDispatch(putTodos(newState, action.payload));
  }
})(todos);

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
  LOGIN_FULFILLED: (ui: UIState, action: AsyncDispatchAction<any>) => {
    setAccessToken(action.payload);
    action.asyncDispatch(getUserSettings());
    return { ...ui, accessToken: action.payload, loggingIn: false };
  },
  SIGN_UP_FULFILLED: (ui: UIState, action: AsyncDispatchAction<any>) => {
    setAccessToken(action.payload);
    action.asyncDispatch(getUserSettings());
    return { ...ui, accessToken: action.payload, loggingIn: false };
  },
  FILTER_CATEGORY: (ui: UIState, action: A<any>) => {
    return { ...ui, filterCategory: action.payload };
  },
  CLEAR_FILTER: (ui: UIState, action: A<any>) => {
    return { ...ui, filterCategory: undefined };
  },
  PUT_TODOS_REJECTED: (ui: UIState, action: A<any>) => {
    if (action.payload.response.status === 401) {
      removeAccessToken();
      return { ...ui, accessToken: undefined };
    }
    return ui;
  },
  DELETE_TODO_REJECTED: (ui: UIState, action: A<any>) => {
    if (action.payload.response.status === 401) {
      removeAccessToken();
      return { ...ui, accessToken: undefined };
    }
    return ui;
  },

  TOGGLE_SHOW_INSTALL: (ui: UIState, action: A<any>) => {
    return {
      ...ui,
      showInstall: !ui.showInstall
    };
  },

  INSTALL: (ui: UIState, action: A<any>) => {
    promptInstall();
    return {
      ...ui,
      showInstall: false
    };
  },

  SETTINGS: (ui: UIState, action: A<any>) => {
    return {
      ...ui,
      showSettings: !ui.showSettings
    };
  },

  CHANGE_USER_SETTINGS_FULFILLED: (ui: UIState, action: A<any>) => {
    return {
      ...ui,
      userSettings: {
        notificationTime: action.payload.time,
        mail: action.payload.mail
      }
    };
  },

  GET_USER_SETTINGS_FULFILLED: (ui: UIState, action: AsyncFinishAction<any>) => {
    action.asyncFinish(() => routerHistory.push('/'));
    return {
      ...ui,
      userSettings: {
        notificationTime: action.payload.time,
        mail: action.payload.mail
      }
    };
  },

  TOGGLE_MENU: (ui: UIState, action: A<any>) => {
    return {
      ...ui,
      menuOpen: action.payload
    };
  },
}, { 
  inputValue: '', 
  editValue: '', 
  loggingIn: false, 
  accessToken: setupAccessToken(), 
  showInstall: false, 
  showSettings: false,
  userSettings: {
    notificationTime: moment().hour(10).minute(0).second(0),
    mail: true
  },
  menuOpen: false
});

function loadLocal(contents: any): Todo[] {
  var todos: Todo[] = [];
  if (Array.isArray(contents)) {
    todos = contents;
  } else if (contents.todos) {
    todos = contents.todos;
  }
  todos = todos.map(todo => {
    return {
      ...todo,
      date: todo.date ? moment(todo.date).toDate() : undefined,
      timestamp: todo.timestamp ? todo.timestamp : new Date(),
      serverTimestamp: todo.serverTimestamp ? moment(todo.serverTimestamp).toDate() : undefined,
      files: todo.files ? todo.files : []
    };
  });
  return todos;
}

export const rootReducer = combineReducers({
  todos: historyReducer(saveReducer('data', todosDispatched, loadLocal)),
  ui: ui,
  routing: routerReducer
});
