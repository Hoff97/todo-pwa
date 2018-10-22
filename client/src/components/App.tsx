import * as React from 'react';
import ButtonsV from '../containers/Buttons'
import VisibleTodoList from 'src/containers/TodoList';
import Login from 'src/containers/Login';

const MainPage = () => (
  <div className="container mt-2">
    <ButtonsV />
    <Login />
    <VisibleTodoList />
    {
      process.env.REACT_APP_VERSION && process.env.REACT_APP_TIME &&
      <span className="text-muted small">
        <a href={'https://github.com/Hoff97/todo-pwa/commit/' + process.env.REACT_APP_VERSION}>
          {process.env.REACT_APP_VERSION.substring(0,8)}
        </a>@{process.env.REACT_APP_TIME}
      </span>
    }
  </div>
)

export default MainPage