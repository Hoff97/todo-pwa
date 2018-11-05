import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from 'src/types';
import Drawer from 'rmc-drawer';
import { Route, Switch } from 'react-router-dom';
import NotFound from './NotFound';
import MainPage from 'src/components/MainPage';
import { toggleMenu } from 'src/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    dispatch: Dispatch<Action<any>>;
    open: boolean;
}

const sidebar = (<div>
    <h3>
        Menu
    </h3>
    <p>this is content!</p>
</div>);

function MenuF({ dispatch, open }: Props) {
    return (
        <div>
            <Drawer sidebar={sidebar} open={open}
                    docked={false} transitions={true}
                    touch={true} enableDragHandle={true} position={'left'}
                    dragToggleDistance={30} style={{ overflow: 'auto' }}
                    onOpenChange={op => dispatch(toggleMenu())}>
                <div className="menuOpener">
                    <span onClick={ev => dispatch(toggleMenu())}><FontAwesomeIcon icon="bars" size="2x"/></span>
                </div>
                <Switch>
                    <Route exact path="" component={MainPage} />
                    <Route exact path="/" component={MainPage} />
                    <Route component={NotFound} />
                </Switch>
            </Drawer>
        </div>
    );
}

let Menu = connect((state: StoreState) => {
    return {
        open: state.ui.menuOpen
    }
}, (dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(MenuF);

export default Menu;