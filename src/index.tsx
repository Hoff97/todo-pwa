import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, Middleware } from 'redux';
import { todos } from './reducers/index';
import { StoreState, Todo } from './types/index';
import { Provider } from 'react-redux';
import App from './components/App';
import { initHistory, HistoryState, historyReducer } from './reducers/enhancers/history';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveReducer, initByStorage } from './reducers/enhancers/storage';
import { Action } from 'redux-actions';

const logger: Middleware = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result
}

function loadLocal(contents: any): Todo[] {
  if(Array.isArray(contents)) {
    return contents;
  } else if (contents.todos) {
    return contents.todos;
  }
  return [];
}

const reducer = historyReducer(saveReducer('data', todos, loadLocal))

const store = createStore<HistoryState<StoreState>, Action<any>, {}, {}>(reducer, initHistory(initByStorage('data', [], loadLocal)), applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
