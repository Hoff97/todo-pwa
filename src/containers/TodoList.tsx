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
        }).sort((a,b) => {
            if(a.done === b.done)
                return a.name.localeCompare(b.name);
            if(a.done && !b.done)
                return 1;
            return -1;
        })
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.TodoAction>) {
    return {
        toggleTodo: (id: string) => dispatch(actions.toggleTodo(id)),
        deleteTodo: (id: string) => dispatch(actions.deleteTodo(id))
    }
}

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default VisibleTodoList;