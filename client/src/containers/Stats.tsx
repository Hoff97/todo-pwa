import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import Stats from 'src/components/Stats';
import moment from 'moment';

export function mapStateToProps(state: StoreState) {
    const open = state.todos.filter(x => !x.done).length;

    const ttD = state.todos.length > 0 ? Math.round(state.todos
        .filter(todo => todo.done)
        .map(todo => moment(todo.timestamp).diff(moment(todo.created), 'hours'))
        .reduce((a,b) => a+b, 0)/state.todos.filter(todo => todo.done).length) : 0;

    return {
        openTodos: open,
        closedTodos: state.todos.length - open,
        ttD
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        
    }
}

const StatsV = connect(mapStateToProps, mapDispatchToProps)(Stats);

export default StatsV;