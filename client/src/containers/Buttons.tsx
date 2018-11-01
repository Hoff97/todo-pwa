import * as actions from '../actions';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import { undo, redo } from 'src/reducers/enhancers/history';
import { Buttons } from 'src/components/Buttons';
import { catInfoFromTodos } from 'src/util/category';

export function mapStateToProps(state: StoreState) {
    return {
        value: state.ui.inputValue,
        categories: catInfoFromTodos(state.todos.state),
        loggedIn: state.ui.accessToken !== undefined && state.ui.accessToken !== null,
        showInstall: state.ui.showInstall
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        addTodo: (str: string) => dispatch(actions.addTodo(str)),
        undo: () => dispatch(undo()),
        redo: () => dispatch(redo()),
        inputChanged: (str: string) => dispatch(actions.inputChanged(str)),
        login: () => dispatch(actions.loginShow()),
        install: () => dispatch(actions.install()),
        settings: () => dispatch(actions.settings())
    }
}

const ButtonsV = connect(mapStateToProps, mapDispatchToProps)(Buttons);

export default ButtonsV;