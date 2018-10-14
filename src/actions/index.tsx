import { createAction } from 'redux-actions';

export const ADD_TODO = 'ADD_TODO';
export const addTodo = createAction(ADD_TODO, (x: string) => x);

export const TODO_TOGGLED = 'TODO_TOGGLED';
export const toggleTodo = createAction(TODO_TOGGLED, (x: string) => x);

export const TODO_DELETED = 'TODO_DELETED';
export const deleteTodo = createAction(TODO_DELETED, (x: string) => x);