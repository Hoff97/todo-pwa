import * as actions from '../actions';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import { undo, redo } from 'src/reducers/enhancers/history';
import { Buttons } from 'src/components/Buttons';

export function mapStateToProps(state: StoreState) {
    return {
        value: state.ui.inputValue,
        categories: state.todos.state
            .map(todo => todo.category ? [todo.category] : [])
            .reduce((acc, val) => acc.concat(val), [])
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        addTodo: (str: string) => dispatch(actions.addTodo(str)),
        undo: () => dispatch(undo()),
        redo: () => dispatch(redo()),
        inputChanged: (str: string) => dispatch(actions.inputChanged(str))
    }
}

const ButtonsV = connect(mapStateToProps, mapDispatchToProps)(Buttons);

export default ButtonsV;