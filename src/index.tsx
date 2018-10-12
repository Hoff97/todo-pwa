import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, Middleware } from 'redux';
import { rootReducer } from './reducers/index';
import { StoreState, TodoFilter } from './types/index';
import { Provider } from 'react-redux';
import { TodoAction } from './actions';
import App from './components/App';
import { initHistory, HistoryState, historyReducer } from './reducers/enhancers/history';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveReducer, initByStorage } from './reducers/enhancers/storage';

const logger: Middleware = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const reducer = historyReducer(saveReducer('data', rootReducer))

const store = createStore<HistoryState<StoreState>, TodoAction, {}, {}>(reducer, initHistory(initByStorage('data', {
  todos: [],
  shownTodos: TodoFilter.ALL
})), applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
