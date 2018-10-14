import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TodoList } from 'src/components/TodoList';
import { HistoryState } from 'src/reducers/enhancers/history';
import { Action } from 'redux-actions';

export function mapStateToProps(state: HistoryState<StoreState>) {
    return {
        todos: state.state.sort((a,b) => {
            if(a.done === b.done)
                return a.name.localeCompare(b.name);
            if(a.done && !b.done)
                return 1;
            return -1;
        })
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        toggleTodo: (id: string) => dispatch(actions.toggleTodo(id)),
        deleteTodo: (id: string) => dispatch(actions.deleteTodo(id))
    }
}

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default VisibleTodoList;