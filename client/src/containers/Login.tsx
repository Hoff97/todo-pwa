import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { login, signUp, clearFilter } from 'src/actions';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StoreState } from 'src/types';
import { catInfoFromTodos, CategoryInfo } from 'src/util/category';

interface Props {
    dispatch: Dispatch<Action<any>>;
    loggingIn: boolean;
    filterCategory?: string;
    categoryInfo: CategoryInfo[];
}

function LoginF({ dispatch, loggingIn, filterCategory, categoryInfo }: Props) {
    function categoryColor(name: string) {
        return categoryInfo.filter(x => x.name === name)[0].color;
    }
    let mail: HTMLInputElement
    let pw: HTMLInputElement
    if (loggingIn) {
        return (
            <div>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Email"
                        aria-label="Recipient's username" aria-describedby="button-addon2"
                        ref={node => {
                            mail = node as HTMLInputElement
                        }} />
                    <input type="password" className="form-control" placeholder="Passwort"
                        aria-label="Recipient's username" aria-describedby="button-addon2"
                        ref={node => {
                            pw = node as HTMLInputElement
                        }} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary"
                            id="button-addon2"
                            onClick={e => dispatch(login(mail.value, pw.value))}>
                            <FontAwesomeIcon icon="sign-in-alt" />
                        </button>
                        <button className="btn btn-outline-secondary"
                            id="button-addon2"
                            onClick={e => dispatch(signUp(mail.value, pw.value))}>
                            <FontAwesomeIcon icon="user-plus"/>
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                {filterCategory &&
                    <div style={{'backgroundColor': categoryColor(filterCategory)}} className="categoryLabel">
                        #{filterCategory}
                        <a onClick={e => dispatch(clearFilter())}> <FontAwesomeIcon icon="times"/></a>
                    </div>
                }
            </div>
            );
    }
}

let Login = connect((state: StoreState) => {
    return {
        loggingIn: state.ui.loggingIn,
        filterCategory: state.ui.filterCategory,
        categoryInfo: catInfoFromTodos(state.todos.state)
    }
}, (dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(LoginF);

export default Login;