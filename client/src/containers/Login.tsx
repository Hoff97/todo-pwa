import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { login, signUp } from 'src/actions';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    dispatch: Dispatch<Action<any>>;
}

function LoginF({ dispatch }: Props) {
    let mail: HTMLInputElement
    let pw: HTMLInputElement
    return (
        <div className="container mt-2">
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
            </div>
            <button className="btn btn-outline-secondary mr-2"
                id="button-addon2"
                onClick={e => dispatch(login(mail.value, pw.value))}>
                <FontAwesomeIcon icon="sign-in-alt" /> Login
            </button>
            <button className="btn btn-outline-secondary"
                id="button-addon2"
                onClick={e => dispatch(signUp(mail.value, pw.value))}>
                <FontAwesomeIcon icon="user-plus" /> Sign up
            </button>
        </div>
    );
}

let Login = connect((dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(LoginF);

export default Login;