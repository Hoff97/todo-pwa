import * as actions from '../actions/';
import { StoreState, TodoFilter } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TodoList } from 'src/components/TodoList';

export function mapStateToProps({ todos, shownTodos }: StoreState) {
    return {
        todos: todos.filter(todo => {
            switch(shownTodos) {
                case TodoFilter.ALL: return true;
                case TodoFilter.DONE: return todo.done;
                case TodoFilter.UNDONE: return !todo.done;
            }
        })
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.TodoAction>) {
    return {
        toggleTodo: (id: string) => dispatch(actions.toggleTodo(id))
    }
}

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default VisibleTodoList;