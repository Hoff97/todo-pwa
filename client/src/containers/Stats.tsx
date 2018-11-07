import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import Stats from 'src/components/Stats';
import moment from 'moment';
import { catInfoFromTodos } from 'src/util/category';

export function mapStateToProps(state: StoreState) {
    const open = state.todos.filter(x => !x.done).length;

    const ttD = state.todos.length > 0 ? Math.round(state.todos
        .filter(todo => todo.done)
        .map(todo => moment(todo.timestamp).diff(moment(todo.created), 'hours'))
        .reduce((a,b) => a+b, 0)/state.todos.filter(todo => todo.done).length) : 0;

    const categories = [...catInfoFromTodos(state.todos), { name: 'None', color: '#DDD'} ]

    const todosByCategory = categories
        .map(category => [
            state.todos.filter(x => (x.category ? x.category : 'None') === category.name).length, 
            category])
        .sort((x,y) => (y[0] as number) - (x[0] as number))

    return {
        openTodos: open,
        closedTodos: state.todos.length - open,
        ttD,
        categories: todosByCategory.map(x => x[1]),
        todosByCategory: todosByCategory.map(x => x[0])
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        
    }
}

const StatsV = connect(mapStateToProps, mapDispatchToProps)(Stats);

export default StatsV;