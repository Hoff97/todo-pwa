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

const logger: Middleware = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const store = createStore<StoreState, TodoAction, {}, {}>(rootReducer, {
  todos: [],
  shownTodos: TodoFilter.ALL
}, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
