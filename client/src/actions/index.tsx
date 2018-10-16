import { createAction } from 'redux-actions';
import { Todo } from 'src/types';

export const ADD_TODO = 'ADD_TODO';
export const addTodo = createAction(ADD_TODO, (x: string) => x);

export const TODO_TOGGLED = 'TODO_TOGGLED';
export const toggleTodo = createAction(TODO_TOGGLED, (x: string) => x);

export const TODO_DELETED = 'TODO_DELETED';
export const deleteTodo = createAction(TODO_DELETED, (x: string) => x);

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
export const login = createAction(LOGIN_SHOW, (mail: String, pw: String) => [mail, pw])