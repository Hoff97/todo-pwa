import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from 'src/types';
import Drawer from 'rmc-drawer';
import { Route, Switch, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import NotFound from './NotFound';
import MainPage from 'src/components/MainPage';
import { toggleMenu } from 'src/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Settings from './Settings';
import Login from './Login';
import StatsV from './Stats';

interface Props extends RouteComponentProps {
    dispatch: Dispatch<Action<any>>;
    open: boolean;
    loggedIn: boolean;
}

function sidebar(loggedIn: boolean) {
    return (<div>
        <h3>
            Menu
        </h3>
        <ul className="list-group">
            <li className="list-group-item clickable"><Link to="/">Main page</Link></li>
            <li className="list-group-item clickable"><Link to="/stats">Statistics</Link></li>
            {!loggedIn &&
                <li className="list-group-item clickable"><Link to="login">Log in</Link></li>
            }
            {loggedIn &&
                <li className="list-group-item clickable"><Link to="/settings">Settings</Link></li>
            }
        </ul>
    </div>);
}

function MenuF({ dispatch, open, loggedIn }: Props) {
    return (
        <div>
            <Drawer sidebar={sidebar(loggedIn)} open={open}
                docked={false} transitions={true}
                touch={true} enableDragHandle={true} position={'left'}
                dragToggleDistance={30} style={{ overflow: 'auto' }}
                onOpenChange={op => dispatch(toggleMenu(op))}
                dragHandleStyle={{ width: '10px' }}>
                { window.innerWidth > 590 &&
                    <div className="menuOpener">
                        <span onClick={ev => dispatch(toggleMenu(true))}><FontAwesomeIcon icon="bars" size="2x"/></span>
                    </div>
                }
                <Switch>
                    <Route exact path="/" component={MainPage} />
                    <Route exact path="/index.html" component={MainPage} />
                    <Route exact path="/stats" component={StatsV} />
                    <Route exact path="/settings" component={Settings} />
                    <Route exact path="/login" component={Login} />
                    <Route component={NotFound} />
                </Switch>
            </Drawer>
        </div>
    );
}

let Menu = withRouter(connect((state: StoreState) => {
    return {
        open: state.ui.menuOpen,
        loggedIn: state.ui.accessToken !== undefined
    }
}, (dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(MenuF));

export default Menu;