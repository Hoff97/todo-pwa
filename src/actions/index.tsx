import * as constants from '../constants';
import { TodoFilter } from 'src/types';

export interface AddTodo {
    type: constants.ADD_TODO;
    name: string;
}

export interface TodoToggled {
    type: constants.TODO_TOGGLED;
    id: string;
}

export interface TodoDeleted {
    type: constants.TODO_DELETED;
    id: string;
}

export interface FilterChanged {
    type: constants.FILTER_CHANGED;
    filter: TodoFilter;
}

export type TodoAction = AddTodo | TodoToggled | FilterChanged | TodoDeleted;

export function addTodo(name: string): TodoAction {
    return {
        type: constants.ADD_TODO,
        name
    }
}

export function toggleTodo(id: string): TodoAction {
    return {
        type: constants.TODO_TOGGLED,
        id
    }
}

export function deleteTodo(id: string): TodoAction {
    return {
        type: constants.TODO_DELETED,
        id
    }
}

export function changeFilter(filter: TodoFilter): FilterChanged {
    return {
        type: constants.FILTER_CHANGED,
        filter
    }
}