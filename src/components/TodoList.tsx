import * as React from 'react';
import Todo from './Todo';
import { Todo as TodoT } from '../types/index';
import { catInfoFromTodos } from 'src/util/category';

export interface Props {
    todos: TodoT[];
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
}

export function TodoList({ todos, toggleTodo, deleteTodo }: Props) {
    const catInfo = catInfoFromTodos(todos);
    function categoryColor(name: string) {
        return catInfo.filter(x => x.name === name)[0].color;
    }
    return (
        <div className="mt-2 mb-2">
            <table className="table">
                {todos.map((todo, index) => (
                    <Todo toggle={() => toggleTodo(todo.id)} remove={() => deleteTodo(todo.id)} {...todo} 
                        key={todo.id} categoryColor={todo.category ? categoryColor(todo.category) : undefined}/>
                ))}
            </table>
            <div>{todos.length === 0 ? 'No todos' : ''}</div>
        </div>
    );
}