import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from 'src/types';
import { Link } from 'react-router-dom';

interface Props {
    dispatch: Dispatch<Action<any>>;
}

function NotFoundF({ dispatch }: Props) {
    return (
        <div className="container">
            This content could not be found!<br/>
            <Link to="/">Go back home</Link>
        </div>
    );
}

let NotFound = connect((state: StoreState) => {
    return {
    }
}, (dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(NotFoundF);

export default NotFound;