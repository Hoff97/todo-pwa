import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import Stats from 'src/components/Stats';
import moment from 'moment';
import { catInfoFromTodos } from 'src/util/category';

const dayFormat = 'DD.MM.';

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

    const days = [0,-1,-2,-3,-4,-5,-6,-7].reverse()
        .map(x => moment().add(x, 'days').format(dayFormat))
        .map(day => {
            return {
                day,
                done: state.todos.filter(x => x.done && moment(x.timestamp).format(dayFormat) === day).length,
                created: state.todos.filter(x => moment(x.created).format(dayFormat) === day).length
            };
        });

    const todosByPriority = [5,4,3,2,1].map(prio => state.todos.filter(todo => (todo.priority ? todo.priority : 1) === prio).length)

    const daysPrio = state.todos.filter(x => x.date && !x.done)
        .map(x => { 
            return { 
                daysLeft: Math.max(moment(x.date).diff(moment().hours(0).minutes(0), 'days'), 0), 
                prio: x.priority, 
                name: x.name 
            }})

    return {
        openTodos: open,
        closedTodos: state.todos.length - open,
        ttD,
        categories: todosByCategory.map(x => x[1]),
        todosByCategory: todosByCategory.map(x => x[0]),
        todosByDate: days,
        todosByPriority,
        daysPrio
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        
    }
}

const StatsV = connect(mapStateToProps, mapDispatchToProps)(Stats);

export default StatsV;