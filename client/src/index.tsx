import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers/index';
import { StoreState } from './types/index';
import { Provider } from 'react-redux';
import MainPage from './components/MainPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Action } from 'redux-actions';
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faCheck, faUndo, faPlus, faRedo, faUser, faSignInAlt, faUserPlus, faBell, faTimes } from '@fortawesome/free-solid-svg-icons'
import { logger } from './reducers/middleware/logger';
import { asyncDispatchMiddleware } from './reducers/middleware/async-dispatch';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound from './containers/NotFound';
import { putTodos } from './actions';

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

const store = createStore<StoreState, Action<any>, {}, {}>(rootReducer, applyMiddleware(logger, promiseMiddleware(), ReduxThunk, asyncDispatchMiddleware));

store.dispatch(putTodos(store.getState().todos.state));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Switch>
          <Route exact path="" component={MainPage} />
          <Route exact path="/" component={MainPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

Notification.requestPermission().then(function (result) {
});
