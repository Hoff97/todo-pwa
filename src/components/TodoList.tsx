import * as React from 'react';
import Todo from './Todo';
import { Todo as TodoT } from '../types/index';

export interface Props {
    todos: TodoT[];
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
}

export function TodoList({ todos, toggleTodo, deleteTodo }: Props) {
    return (
        <div className="mt-2">
            <ul className="list-group">
                {todos.map((todo, index) => (
                    <li key={todo.id} className={todo.done ? 'list-group-item disabled' : 'list-group-item'}>
                        <Todo toggle={() => toggleTodo(todo.id)} remove={() => deleteTodo(todo.id)} {...todo} />
                    </li>
                ))}
            </ul>
            <div>{todos.length === 0 ? 'No todos' : ''}</div>
        </div>
    );
}