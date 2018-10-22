import { createAction } from 'redux-actions';
import { Todo } from 'src/types';
import { loginRequest, signUpRequest } from 'src/rest/auth';
import { todoPut, deleteTodoRequest } from 'src/rest/todo';

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

export const FILTER_CATEGORY = 'FILTER_CATEGORY';
export const filterCategory = createAction(FILTER_CATEGORY, (category: string) => category)

export const CLEAR_FILTER = 'CLEAR_FILTER';
export const clearFilter = createAction(CLEAR_FILTER, () => {})