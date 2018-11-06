import * as React from 'react';
import Todo from './Todo';
import { Todo as TodoT } from '../types/index';
import { CategoryInfo } from 'src/util/category';
import QueueAnim from 'rc-queue-anim';

export interface Props {
    todos: TodoT[];
    editingTodo?: string;
    editValue: string;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    editTodo: (todo: TodoT) => void;
    finishEdit: (id: string, str: string) => void;
    addFile: (todoId: string, file: File) => void;
    deleteFile: (id: string, todoId: string) => void;
    editChange: (str: string) => void;
    categoryInfo: CategoryInfo[];
    commentChanged: (todoId: string, comment: string) => void;
}

export function TodoList({ todos, toggleTodo, deleteTodo, editingTodo, editTodo, finishEdit,
    editChange, editValue, categoryInfo, addFile, deleteFile, commentChanged }: Props) {
    function categoryColor(name: string) {
        return categoryInfo.filter(x => x.name === name)[0].color;
    }
    return (
        <div className="mt-2 mb-2">
            <table className="table table-hover table-striped">
                <QueueAnim component='tbody' type='scale' interval={50}>
                    {todos.map((todo) => (
                        <Todo toggle={() => toggleTodo(todo.id)} remove={() => deleteTodo(todo.id)} {...todo}
                            key={todo.id} categoryColor={todo.category ? categoryColor(todo.category) : undefined}
                            edit={() => editTodo(todo)}
                            doneEditing={(str: string) => finishEdit(todo.id, str)}
                            editing={editingTodo === todo.id}
                            editValue={editValue}
                            editChange={editChange}
                            categories={categoryInfo}
                            comment={todo.comment}
                            files={todo.files}
                            addFile={(file: File) => addFile(todo.id, file)}
                            deleteFile={(id: string) => deleteFile(id, todo.id)}
                            commentChanged={(comment: string) => commentChanged(todo.id, comment)} />
                    ))}
                </QueueAnim>
            </table>
            <div>{todos.length === 0 ? 'No todos' : ''}</div>
        </div>
    );
}