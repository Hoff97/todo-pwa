import * as React from 'react';
import Todo from './Todo';
import { Todo as TodoT } from '../types/index';

export interface Props {
    todos: TodoT[];
    toggleTodo: (id: string) => void;
}

export function TodoList({ todos, toggleTodo }: Props) {
    return (
        <div className="mt-2">
            <ul className="list-group">
                {todos.map((todo, index) => (
                    <li key={todo.id} className={todo.done ? 'list-group-item' : 'list-group-item active'}>
                        <Todo toggle={() => toggleTodo(todo.id)} {...todo} />
                    </li>
                ))}
            </ul>
            <div>{todos.length === 0 ? 'No todos' : ''}</div>
        </div>
    );
}