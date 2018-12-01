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
import Loadable from 'react-loadable';
import Calendar from './Calendar';

interface Props extends RouteComponentProps {
    dispatch: Dispatch<Action<any>>;
    open: boolean;
    loggedIn: boolean;
    route: string;
}

function sidebar(loggedIn: boolean, route: string) {
    const links = [
        { link: '/', text: 'Main Page' },
        { link: '/calendar', text: 'Calendar' },
        { link: '/stats', text: 'Statistics' },
        loggedIn ? { link: '/login', text: 'Log in' } : { link: '/settings', text: 'Settings' },
    ]
    if(route === '')
        route = '/'
    return (<div>
        <h3>
            Menu
        </h3>
        <ul className="list-group">
            {links.map(link => (
                <li className={'list-group-item clickable' + (link.link === route ? ' active' : '')} key={link.link}>
                    <Link to={link.link} style={{color: link.link === route ? '#FFF' : '#55F'}}>{link.text}</Link>
                </li>
            ))}
        </ul>
    </div>);
}


const Loading = () => {
    return <div>Loading...</div>
}

const Stats = Loadable({
    loader: () => {
        return import('./Stats').then((x: any) => {
            return (new Promise(resolve => {
                x((y: any) => resolve(y))
            })) as any;
        });
    },
    loading: Loading,
});

function MenuF({ dispatch, open, loggedIn, route }: Props) {
    return (
        <div>
            <Drawer sidebar={sidebar(loggedIn, route)} open={open}
                docked={false} transitions={true}
                touch={true} enableDragHandle={true} position={'left'}
                dragToggleDistance={30} style={{ overflow: 'auto' }}
                onOpenChange={op => dispatch(toggleMenu(op))}
                dragHandleStyle={{ width: '12px' }}>
                {window.innerWidth > 590 &&
                    <div className="menuOpener">
                        <span onClick={ev => dispatch(toggleMenu(true))}><FontAwesomeIcon icon="bars" size="2x" /></span>
                    </div>
                }
                <Switch>
                    <Route exact path="/" component={MainPage} />
                    <Route exact path="/index.html" component={MainPage} />
                    <Route exact path="/calendar" component={Calendar} />
                    <Route exact path="/stats" component={Stats} />
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
        loggedIn: state.ui.accessToken !== undefined,
        route: state.routing.pathname
    }
}, (dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(MenuF));

export default Menu;