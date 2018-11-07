import * as actions from '../actions';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import { Buttons } from 'src/components/Buttons';
import { catInfoFromTodos } from 'src/util/category';

export function mapStateToProps(state: StoreState) {
    return {
        value: state.ui.inputValue,
        categories: catInfoFromTodos(state.todos),
        showInstall: state.ui.showInstall
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        addTodo: (str: string) => dispatch(actions.addTodo(str)),
        inputChanged: (str: string) => dispatch(actions.inputChanged(str)),
        install: () => dispatch(actions.install())
    }
}

const ButtonsV = connect(mapStateToProps, mapDispatchToProps)(Buttons);

export default ButtonsV;