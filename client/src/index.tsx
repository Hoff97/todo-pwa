import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers/index';
import { StoreState } from './types/index';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Action } from 'redux-actions';
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faCheck, faPlus, faUser, faSignInAlt, faUserPlus, faBell, faTimes, faDownload, faCog, faSave, faBars, faUndo, faUpload } from '@fortawesome/free-solid-svg-icons'
import { logger } from './reducers/middleware/logger';
import { asyncDispatchMiddleware } from './reducers/middleware/async-dispatch';

import { putTodos, toggleShowInstall, getUserSettings as gUSA, locationChange, getDevices } from './actions';

import 'rmc-drawer/assets/index.css'
import Menu from './containers/Menu';

import { routerMiddleware } from 'react-router-redux'

import createHistory from 'history/createBrowserHistory'
import { Router } from 'react-router';
import { asyncFinishMiddleware } from './reducers/middleware/after-finish';

library.add(faTrash, faCheck, faPlus, faUser, faSignInAlt, 
  faUserPlus, faBell, faTimes, faDownload, faCog, faBars, 
  faSave, faUndo, faUpload)

export const routerHistory = createHistory()

const middleware = applyMiddleware(
  logger, 
  promiseMiddleware(),
  ReduxThunk, 
  asyncDispatchMiddleware,
  routerMiddleware(routerHistory),
  asyncFinishMiddleware)

const store = createStore<StoreState, Action<any>, {}, {}>(rootReducer, middleware);

if(store.getState().ui.accessToken !== undefined) {
  store.dispatch(putTodos(store.getState().todos));
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={routerHistory}>
      <Menu></Menu>
    </Router>
  </Provider>
  ,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

let deferredPrompt: Event | undefined;

export function promptInstall() {
  (deferredPrompt as any).prompt();
  (deferredPrompt as any).userChoice
    .then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = undefined;
    });
}

export function getUserSettings() {
  store.dispatch(gUSA())
  store.dispatch(getDevices())
}

routerHistory.listen(x => {
  store.dispatch(locationChange(x));
})

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  console.log(e);

  store.dispatch(toggleShowInstall())

  deferredPrompt = e;
});