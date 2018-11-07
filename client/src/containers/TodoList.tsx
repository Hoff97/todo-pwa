import * as actions from '../actions/';
import { StoreState, Todo } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TodoList } from 'src/components/TodoList';
import { Action } from 'redux-actions';
import { catInfoFromTodos } from 'src/util/category';
import { compare } from 'src/util/todo';

const mapStateToProps = (state: StoreState) => {
    let params = new URLSearchParams(state.routing.search);
    const category = params.get('category')
    return {
        todos: state.todos
            .filter(todo => {
                if (category) {
                    return todo.category === category
                } else {
                    return true;
                }
            })
            .sort((a, b) => compare(a,b)),
        editingTodo: state.ui.editingTodo,
        editValue: state.ui.editValue,
        categoryInfo: catInfoFromTodos(state.todos)
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        toggleTodo: (id: string) => dispatch(actions.toggleTodo(id)),
        deleteTodo: (id: string) => dispatch(actions.deleteTodo(id)),
        editTodo: (todo: Todo) => dispatch(actions.editTodo(todo)),
        finishEdit: (id: string, str: string) => dispatch(actions.finishEdit(id, str)),
        editChange: (str: string) => dispatch(actions.editChange(str)),
        addFile: (todoId: string, file: File) => dispatch(actions.addFile(todoId, file)),
        deleteFile: (id: string, todoId: string) => dispatch(actions.deleteFile(id, todoId)),
        commentChanged: (todoId: string, comment: string) => dispatch(actions.commentChanged(todoId, comment))
    }
}

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default VisibleTodoList;