import * as actions from '../actions/';
import { StoreState, TodoFilter } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TodoList } from 'src/components/TodoList';
import { HistoryState } from 'src/reducers/enhancers/history';

export function mapStateToProps(state: HistoryState<StoreState>) {
    return {
        todos: state.state.todos.filter(todo => {
            switch(state.state.shownTodos) {
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