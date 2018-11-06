import * as React from 'react';
import ButtonsV from '../containers/Buttons'
import VisibleTodoList from 'src/containers/TodoList';
import Category from 'src/containers/CategoryFilter';

function MainPage(history: any) {
  let params = new URLSearchParams(history.location.search);
  const category = params.get('category')
  const TodoList = VisibleTodoList(category);
  const Cat = Category(category)
  return (
    <div className="container mt-2">
      <ButtonsV />
      <Cat/>
      <TodoList/>
      {
        process.env.REACT_APP_VERSION && process.env.REACT_APP_TIME &&
        <span className="text-muted small">
          <a href={'https://github.com/Hoff97/todo-pwa/commit/' + process.env.REACT_APP_VERSION}>
            {process.env.REACT_APP_VERSION.substring(0,8)}
          </a>@{process.env.REACT_APP_TIME}
        </span>
      }
    </div>
  );
}

export default MainPage