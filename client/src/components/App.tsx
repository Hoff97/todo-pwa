import * as React from 'react';
import ButtonsV from '../containers/Buttons'
import VisibleTodoList from 'src/containers/TodoList';
import Login from 'src/containers/Login';
​
const App = () => (
  <div className="container mt-2">
    <ButtonsV />
    <Login />
    <VisibleTodoList />
  </div>
)
​
export default App