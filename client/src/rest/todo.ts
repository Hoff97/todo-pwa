import { Todo } from 'src/types';
import { axios } from './config';
import * as moment from 'moment';

const url = '/api/v1/todo'

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export function todoPut(todos: Todo[]) {
    const mappedTodos = todos.map(todo => {
        return {
            ...todo,
            timestamp: moment(todo.timestamp).format(dateFormat),
            date: todo.date ? moment(todo.timestamp).format(dateFormat) : undefined
        }
    });
    return axios.put(url, mappedTodos).then(response => {
        return response.data;
    })
}