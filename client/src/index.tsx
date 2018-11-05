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
import { faTrash, faCheck, faUndo, faPlus, faRedo, faUser, faSignInAlt, faUserPlus, faBell, faTimes, faDownload, faCog, faSave, faBars } from '@fortawesome/free-solid-svg-icons'
import { logger } from './reducers/middleware/logger';
import { asyncDispatchMiddleware } from './reducers/middleware/async-dispatch';

import { putTodos, toggleShowInstall, getUserSettings as gUSA } from './actions';

import 'rmc-drawer/assets/index.css'
import Menu from './containers/Menu';

import { routerMiddleware } from 'react-router-redux'

import createHistory from 'history/createBrowserHistory'
import { Router } from 'react-router';
import { asyncFinishMiddleware } from './reducers/middleware/after-finish';

library.add(faTrash)
library.add(faUndo)
library.add(faCheck)
library.add(faPlus)
library.add(faUndo)
library.add(faRedo)
library.add(faUser)
library.add(faSignInAlt)
library.add(faUserPlus)
library.add(faBell)
library.add(faTimes)
library.add(faDownload)
library.add(faCog)
library.add(faSave)
library.add(faTimes)
library.add(faBars)

export const routerHistory = createHistory()

const middleware = applyMiddleware(
  logger, 
  promiseMiddleware(),
  ReduxThunk, 
  asyncDispatchMiddleware,
  routerMiddleware(routerHistory),
  asyncFinishMiddleware)

const store = createStore<StoreState, Action<any>, {}, {}>(rootReducer, middleware);

store.dispatch(putTodos(store.getState().todos.state));

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

Notification.requestPermission().then(function (result) {
});

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
}

routerHistory.listen(x => {
  console.log(x);
})

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  console.log(e);

  store.dispatch(toggleShowInstall())

  deferredPrompt = e;
});