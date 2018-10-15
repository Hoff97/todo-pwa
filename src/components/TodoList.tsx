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
        <div className="mt-2 mb-2">
            <table className="table">
                {todos.map((todo, index) => (
                    <Todo toggle={() => toggleTodo(todo.id)} remove={() => deleteTodo(todo.id)} {...todo} key={todo.id}/>
                ))}
            </table>
            <div>{todos.length === 0 ? 'No todos' : ''}</div>
        </div>
    );
}