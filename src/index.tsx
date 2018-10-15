import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, Middleware } from 'redux';
import { rootReducer } from './reducers/index';
import { StoreState } from './types/index';
import { Provider } from 'react-redux';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Action } from 'redux-actions';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash)
library.add(faUndo)
library.add(faCheck)

const logger: Middleware = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result
}

const store = createStore<StoreState, Action<any>, {}, {}>(rootReducer, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
