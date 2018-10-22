import * as actions from '../actions/';
import { StoreState, Todo } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TodoList } from 'src/components/TodoList';
import { Action } from 'redux-actions';
import { catInfoFromTodos } from 'src/util/category';

export function mapStateToProps(state: StoreState) {
    return {
        todos: state.todos.state
            .filter(todo => {
                if (state.ui.filterCategory) {
                    return todo.category === state.ui.filterCategory
                } else {
                    return true;
                }
            })
            .sort((a, b) => {
                if (a.done === b.done) {
                    const pa = a.priority ? a.priority : 3;
                    const pb = b.priority ? b.priority : 3;
                    if (pa === pb)
                        return a.name.localeCompare(b.name);
                    else
                        return pb - pa;
                } else if (a.done && !b.done) {
                    return 1;
                }
                else {
                    return -1;
                }
            }),
        editingTodo: state.ui.editingTodo,
        editValue: state.ui.editValue,
        categoryInfo: catInfoFromTodos(state.todos.state)
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        toggleTodo: (id: string) => dispatch(actions.toggleTodo(id)),
        deleteTodo: (id: string) => dispatch(actions.deleteTodo(id)),
        editTodo: (todo: Todo) => dispatch(actions.editTodo(todo)),
        finishEdit: (id: string, str: string) => dispatch(actions.finishEdit(id, str)),
        editChange: (str: string) => dispatch(actions.editChange(str)),
        filterCategory: (category: string) => dispatch(actions.filterCategory(category))
    }
}

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default VisibleTodoList;