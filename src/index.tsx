import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { rootReducer } from './reducers/index';
import { StoreState, TodoFilter } from './types/index';
import { Provider } from 'react-redux';
import { TodoAction } from './actions';
import App from './components/App';

const store = createStore<StoreState, TodoAction, {}, {}>(rootReducer, {
  todos: [],
  shownTodos: TodoFilter.ALL
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
