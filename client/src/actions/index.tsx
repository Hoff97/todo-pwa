import { createAction } from 'redux-actions';
import { Todo } from 'src/types';
import { loginRequest, signUpRequest, updateUserSettings, getUserSettings as gUS } from 'src/rest/auth';
import { todoPut, deleteTodoRequest, deleteFileRequest } from 'src/rest/todo';
import * as moment from 'moment';

export const ADD_TODO = 'ADD_TODO';
export const addTodo = createAction(ADD_TODO, (x: string) => x);

export const TODO_TOGGLED = 'TODO_TOGGLED';
export const toggleTodo = createAction(TODO_TOGGLED, (x: string) => x);

export const DELETE_TODO = 'DELETE_TODO';
export function deleteTodo(id: string) {
    return {
        type: DELETE_TODO,
        payload: deleteTodoRequest(id)
    }
}

export const INPUT_CHANGED = 'INPUT_CHANGED';
export const inputChanged = createAction(INPUT_CHANGED, (x: string) => x)

export const EDIT_TODO = 'EDIT_TODO';
export const editTodo = createAction(EDIT_TODO, (x: Todo) => x)

export const FINISH_EDIT = 'FINISH_EDIT';
export const finishEdit = createAction(FINISH_EDIT, (id: string, str: string) => [id,str])

export const EDIT_CHANGE = 'EDIT_CHANGE';
export const editChange = createAction(EDIT_CHANGE, (str: string) => str)

export const LOGIN_SHOW = 'LOGIN_SHOW';
export const loginShow = createAction(LOGIN_SHOW, () => {})

export const LOGIN = 'LOGIN';
export const LOGIN_FULFILLED = 'LOGIN_FULFILLED';
export function login(mail: string, pw: string) {
    return {
        type: LOGIN,
        payload: loginRequest(mail, pw)
    }
}

export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_FULFILLED = 'SIGN_UP_FULFILLED';
export function signUp(mail: string, pw: string) {
    return {
        type: SIGN_UP,
        payload: signUpRequest(mail, pw)
    }
}

export const PUT_TODOS = 'PUT_TODOS';
export function putTodos(todos: Todo[], token?: string) {
    return {
        type: PUT_TODOS,
        payload:todoPut(todos, token)
    }
}

export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';
export const receiveToken = createAction(RECEIVE_TOKEN, (token: string) => token)

export const EXPAND_TODO = 'EXPAND_TODO';
export const expandTodo = createAction(EXPAND_TODO, (id: string) => id)

export const ADD_FILE = 'ADD_FILE';
export const addFile = createAction(ADD_FILE, (todoId: string, file: File) => [todoId, file])

export const ADD_FILE_DONE = 'ADD_FILE_DONE';
export const addFileDone = createAction(ADD_FILE_DONE, (todoId: string, file: File, content: string) => [todoId, file, content])

export const DELETE_FILE = 'DELETE_FILE';
export function deleteFile(id: string, todoId: string) {
    return {
        type: DELETE_FILE,
        payload: deleteFileRequest(id, todoId).then(response => {
            return [id, todoId];
        })
    }
}

export const COMMENT_CHANGED = 'COMMENT_CHANGED';
export const commentChanged = createAction(COMMENT_CHANGED, (todoId: string, comment: string) => [todoId, comment])

export const TOGGLE_SHOW_INSTALL = 'TOGGLE_SHOW_INSTALL';
export const toggleShowInstall = createAction(TOGGLE_SHOW_INSTALL, () => {})

export const INSTALL = 'INSTALL';
export const install = createAction(INSTALL, () => {})

export const CHANGE_USER_SETTINGS = 'CHANGE_USER_SETTINGS';
export function changeUserSettings(time: moment.Moment, mail: boolean) {
    return {
        type: CHANGE_USER_SETTINGS,
        payload: updateUserSettings(mail, time)
    }
}

export const GET_USER_SETTINGS = 'GET_USER_SETTINGS';
export function getUserSettings() {
    return {
        type: GET_USER_SETTINGS,
        payload: gUS()
    }
}

export const TOGGLE_MENU = 'TOGGLE_MENU';
export const toggleMenu = createAction(TOGGLE_MENU, (open: boolean) => open)